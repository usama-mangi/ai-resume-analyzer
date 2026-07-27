import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export const VALID_STATUSES = [
  'draft', 'applied', 'phone_screen', 'interviewing',
  'offer', 'rejected', 'accepted', 'withdrawn',
] as const;

export type ApplicationStatus = typeof VALID_STATUSES[number];

@Injectable()
export class ApplicationTrackerService {
  private readonly logger = new Logger(ApplicationTrackerService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: {
    jobId?: string;
    companyName: string;
    roleTitle: string;
    resumeId?: string;
    coverLetterId?: string;
    notes?: string;
  }) {
    return this.prisma.jobApplication.create({
      data: {
        userId,
        jobId: data.jobId || null,
        companyName: data.companyName,
        roleTitle: data.roleTitle,
        resumeId: data.resumeId || null,
        coverLetterId: data.coverLetterId || null,
        notes: data.notes || null,
        status: 'draft',
      },
      include: { job: true },
    });
  }

  async list(userId: string, filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const where: Prisma.JobApplicationWhereInput = { userId };

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }
    if (filters?.search) {
      where.OR = [
        { companyName: { contains: filters.search, mode: 'insensitive' } },
        { roleTitle: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      this.prisma.jobApplication.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        include: { job: true, referral: true },
        skip,
        take: limit,
      }),
      this.prisma.jobApplication.count({ where }),
    ]);

    return { applications, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getById(userId: string, id: string) {
    const app = await this.prisma.jobApplication.findFirst({
      where: { id, userId },
      include: {
        job: true,
        communications: { orderBy: { occurredAt: 'desc' } },
        referral: true,
      },
    });
    if (!app) throw new NotFoundException('Application not found');
    return app;
  }

  async update(userId: string, id: string, data: {
    jobId?: string;
    companyName?: string;
    roleTitle?: string;
    resumeId?: string;
    coverLetterId?: string;
    notes?: string;
    nextSteps?: string;
    nextActionAt?: string;
    referralContact?: string;
  }) {
    const existing = await this.prisma.jobApplication.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException('Application not found');

    return this.prisma.jobApplication.update({
      where: { id },
      data: {
        ...data,
        nextActionAt: data.nextActionAt ? new Date(data.nextActionAt) : undefined,
      },
      include: { job: true },
    });
  }

  async delete(userId: string, id: string) {
    const existing = await this.prisma.jobApplication.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException('Application not found');
    await this.prisma.jobApplication.delete({ where: { id } });
  }

  async updateStatus(userId: string, id: string, status: ApplicationStatus) {
    if (!VALID_STATUSES.includes(status)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    const existing = await this.prisma.jobApplication.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException('Application not found');

    const updateData: Prisma.JobApplicationUpdateInput = { status };

    if (status === 'applied' && !existing.appliedAt) {
      updateData.appliedAt = new Date();
    }

    return this.prisma.jobApplication.update({
      where: { id },
      data: updateData,
      include: { job: true },
    });
  }

  async addCommunicationLog(userId: string, applicationId: string, data: {
    type: string;
    subject?: string;
    content: string;
    direction?: string;
    occurredAt?: string;
    outcome?: string;
  }) {
    const app = await this.prisma.jobApplication.findFirst({ where: { id: applicationId, userId } });
    if (!app) throw new NotFoundException('Application not found');

    return this.prisma.communicationLog.create({
      data: {
        applicationId,
        type: data.type,
        subject: data.subject || null,
        content: data.content,
        direction: data.direction || null,
        occurredAt: data.occurredAt ? new Date(data.occurredAt) : new Date(),
        outcome: data.outcome || null,
      },
    });
  }

  async getCommunicationLogs(userId: string, applicationId: string) {
    const app = await this.prisma.jobApplication.findFirst({ where: { id: applicationId, userId } });
    if (!app) throw new NotFoundException('Application not found');

    return this.prisma.communicationLog.findMany({
      where: { applicationId },
      orderBy: { occurredAt: 'desc' },
    });
  }

  async upsertReferral(userId: string, applicationId: string, data: {
    employeeName: string;
    employeeEmail?: string;
    relationship?: string;
    status?: string;
    notes?: string;
    requestedAt?: string;
    respondedAt?: string;
  }) {
    const app = await this.prisma.jobApplication.findFirst({ where: { id: applicationId, userId } });
    if (!app) throw new NotFoundException('Application not found');

    return this.prisma.referralRequest.upsert({
      where: { applicationId },
      create: {
        applicationId,
        employeeName: data.employeeName,
        employeeEmail: data.employeeEmail || null,
        relationship: data.relationship || null,
        status: data.status || 'requested',
        notes: data.notes || null,
        requestedAt: data.requestedAt ? new Date(data.requestedAt) : new Date(),
        respondedAt: data.respondedAt ? new Date(data.respondedAt) : null,
      },
      update: {
        employeeName: data.employeeName,
        employeeEmail: data.employeeEmail ?? undefined,
        relationship: data.relationship ?? undefined,
        status: data.status ?? undefined,
        notes: data.notes ?? undefined,
        respondedAt: data.respondedAt ? new Date(data.respondedAt) : undefined,
      },
    });
  }

  async getReferral(userId: string, applicationId: string) {
    const app = await this.prisma.jobApplication.findFirst({ where: { id: applicationId, userId } });
    if (!app) throw new NotFoundException('Application not found');
    return this.prisma.referralRequest.findUnique({ where: { applicationId } });
  }

  async getAnalytics(userId: string, filters?: { startDate?: string; endDate?: string }) {
    const where: Prisma.JobApplicationWhereInput = { userId };
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }

    const applications = await this.prisma.jobApplication.findMany({ where, orderBy: { createdAt: 'desc' }, include: { job: true } });

    const total = applications.length;
    const byStatus: Record<string, number> = {};
    for (const app of applications) {
      byStatus[app.status] = (byStatus[app.status] || 0) + 1;
    }

    const bySource: Record<string, number> = {};
    for (const app of applications) {
      const source = app.job?.source || 'direct';
      bySource[source] = (bySource[source] || 0) + 1;
    }

    const applied = byStatus['applied'] || 0;
    const phoneScreen = byStatus['phone_screen'] || 0;
    const interviewing = byStatus['interviewing'] || 0;
    const offer = byStatus['offer'] || 0;
    const accepted = byStatus['accepted'] || 0;

    // Average time from applied to offer (in days)
    const offeredApps = applications.filter(a => a.status === 'offer' && a.appliedAt);
    const avgDaysToOffer = offeredApps.length > 0
      ? offeredApps.reduce((sum, a) => {
          const days = (new Date(a.updatedAt).getTime() - new Date(a.appliedAt!).getTime()) / (1000 * 60 * 60 * 24);
          return sum + days;
        }, 0) / offeredApps.length
      : null;

    return {
      total,
      byStatus,
      bySource,
      avgDaysToOffer: avgDaysToOffer ? Math.round(avgDaysToOffer * 10) / 10 : null,
      conversionRates: {
        appliedToScreen: applied > 0 ? +((phoneScreen / applied) * 100).toFixed(1) : 0,
        screenToInterview: phoneScreen > 0 ? +((interviewing / phoneScreen) * 100).toFixed(1) : 0,
        interviewToOffer: interviewing > 0 ? +((offer / interviewing) * 100).toFixed(1) : 0,
        appliedToOffer: applied > 0 ? +((offer / applied) * 100).toFixed(1) : 0,
        overallSuccess: total > 0 ? +((accepted / total) * 100).toFixed(1) : 0,
      },
    };
  }

  async getPipeline(userId: string) {
    const applications = await this.prisma.jobApplication.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: { job: true, referral: true },
    });

    return applications;
  }
}
