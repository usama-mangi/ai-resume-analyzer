import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

export interface ApplicationDeadline {
  id: string;
  userId: string;
  jobId?: string;
  jobTitle: string;
  companyName: string;
  deadline: Date;
  reminderAt?: Date;
  reminderSent: boolean;
  status: 'upcoming' | 'passed' | 'applied' | 'withdrawn';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeadlineCalendarView {
  month: number;
  year: number;
  deadlines: {
    date: Date;
    items: ApplicationDeadline[];
  }[];
}

@Injectable()
export class DeadlinesService {
  private readonly logger = new Logger(DeadlinesService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async createDeadline(
    userId: string,
    data: {
      jobId?: string;
      companyName: string;
      roleTitle: string;
      deadline: Date;
      reminderAt?: Date;
      notes?: string;
    },
  ): Promise<ApplicationDeadline> {
    let jobTitle = data.roleTitle;

    // If jobId provided, fetch job details
    if (data.jobId) {
      const job = await this.prisma.job.findFirst({
        where: { id: data.jobId, userId },
        select: { title: true, companyName: true },
      });
      if (job) {
        jobTitle = job.title;
      }
    }

    const deadline = await this.prisma.applicationDeadline.create({
      data: {
        userId,
        jobId: data.jobId,
        companyName: data.companyName,
        roleTitle: jobTitle,
        deadline: data.deadline,
        reminderAt: data.reminderAt,
        notes: data.notes,
        status: 'upcoming',
      },
    });

    // Invalidate user's deadline cache
    await this.invalidateUserCache(userId);

    return this.mapDeadline(deadline);
  }

  async getDeadlines(
    userId: string,
    filters: {
      status?: string;
      startDate?: Date;
      endDate?: Date;
      jobId?: string;
    } = {},
  ): Promise<ApplicationDeadline[]> {
    const where: Record<string, unknown> = { userId };

    if (filters.status) where.status = filters.status;
    if (filters.jobId) where.jobId = filters.jobId;
    if (filters.startDate || filters.endDate) {
      where.deadline = {};
      if (filters.startDate) (where.deadline as Record<string, unknown>).gte = filters.startDate;
      if (filters.endDate) (where.deadline as Record<string, unknown>).lte = filters.endDate;
    }

    const deadlines = await this.prisma.applicationDeadline.findMany({
      where,
      orderBy: { deadline: 'asc' },
      include: { job: { select: { id: true, title: true, companyName: true } } },
    });

    return deadlines.map(this.mapDeadline);
  }

  async getDeadlineById(id: string, userId: string): Promise<ApplicationDeadline> {
    const deadline = await this.prisma.applicationDeadline.findFirst({
      where: { id, userId },
      include: { job: { select: { id: true, title: true, companyName: true } } },
    });

    if (!deadline) {
      throw new NotFoundException('Deadline not found');
    }

    return this.mapDeadline(deadline);
  }

  async updateDeadline(
    id: string,
    userId: string,
    data: Partial<{
      deadline: Date;
      reminderAt: Date;
      status: 'upcoming' | 'passed' | 'applied' | 'withdrawn';
      notes: string;
    }>,
  ): Promise<ApplicationDeadline> {
    const existing = await this.prisma.applicationDeadline.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Deadline not found');
    }

    const deadline = await this.prisma.applicationDeadline.update({
      where: { id },
      data,
      include: { job: { select: { id: true, title: true, companyName: true } } },
    });

    await this.invalidateUserCache(userId);

    return this.mapDeadline(deadline);
  }

  async deleteDeadline(id: string, userId: string): Promise<void> {
    const existing = await this.prisma.applicationDeadline.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Deadline not found');
    }

    await this.prisma.applicationDeadline.delete({ where: { id } });
    await this.invalidateUserCache(userId);
  }

  async getCalendarView(
    userId: string,
    year: number,
    month: number, // 0-11
  ): Promise<DeadlineCalendarView> {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);

    const deadlines = await this.getDeadlines(userId, {
      startDate,
      endDate,
    });

    // Group by date
    const byDate = new Map<string, ApplicationDeadline[]>();
    for (const d of deadlines) {
      const dateKey = d.deadline.toISOString().split('T')[0];
      if (!byDate.has(dateKey)) byDate.set(dateKey, []);
      byDate.get(dateKey)!.push(d);
    }

    // Build calendar days
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendar: { date: Date; items: ApplicationDeadline[] }[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split('T')[0];
      calendar.push({
        date,
        items: byDate.get(dateKey) || [],
      });
    }

    return { month, year, deadlines: calendar };
  }

  async getUpcomingReminders(userId: string, daysAhead = 7): Promise<ApplicationDeadline[]> {
    const now = new Date();
    const future = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

    return this.getDeadlines(userId, {
      status: 'upcoming',
      startDate: now,
      endDate: future,
    });
  }

  async getOverdueDeadlines(userId: string): Promise<ApplicationDeadline[]> {
    return this.getDeadlines(userId, {
      status: 'upcoming',
      endDate: new Date(),
    });
  }

  async markReminderSent(id: string, userId: string): Promise<void> {
    await this.prisma.applicationDeadline.update({
      where: { id, userId },
      data: { reminderSent: true },
    });
  }

  async getDeadlineStats(userId: string): Promise<{
    upcoming: number;
    overdue: number;
    applied: number;
    thisWeek: number;
    thisMonth: number;
  }> {
    const now = new Date();
    const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [upcoming, overdue, applied, thisWeek, thisMonth] = await Promise.all([
      this.prisma.applicationDeadline.count({ where: { userId, status: 'upcoming', deadline: { gte: now } } }),
      this.prisma.applicationDeadline.count({ where: { userId, status: 'upcoming', deadline: { lt: now } } }),
      this.prisma.applicationDeadline.count({ where: { userId, status: 'applied' } }),
      this.prisma.applicationDeadline.count({ where: { userId, deadline: { gte: now, lte: weekEnd } } }),
      this.prisma.applicationDeadline.count({ where: { userId, deadline: { gte: now, lte: monthEnd } } }),
    ]);

    return { upcoming, overdue, applied, thisWeek, thisMonth };
  }

  private async invalidateUserCache(userId: string): Promise<void> {
    await this.redis.delPattern(`deadlines:${userId}:*`);
  }

  private mapDeadline(d: any): ApplicationDeadline {
    return {
      id: d.id,
      userId: d.userId,
      jobId: d.jobId,
      jobTitle: d.roleTitle || d.jobTitle,
      companyName: d.companyName,
      deadline: d.deadline,
      reminderAt: d.reminderAt,
      reminderSent: d.reminderSent,
      status: d.status,
      notes: d.notes,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    };
  }
}