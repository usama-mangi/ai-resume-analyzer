import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Request, ParseDatePipe } from '@nestjs/common';
import { SessionGuard } from '../auth/guards/session.guard';
import { DeadlinesService, ApplicationDeadline } from './deadlines.service';
import { BetterAuthRequest } from '../common/types';

@Controller('deadlines')
@UseGuards(SessionGuard)
export class DeadlinesController {
  constructor(private deadlinesService: DeadlinesService) {}

  @Post()
  async createDeadline(
    @Request() req: BetterAuthRequest,
    @Body() body: {
      jobId?: string;
      companyName: string;
      roleTitle: string;
      deadline: string;
      reminderAt?: string;
      notes?: string;
    },
  ): Promise<ApplicationDeadline> {
    return this.deadlinesService.createDeadline(req.user?.userId ?? '', {
      ...body,
      deadline: new Date(body.deadline),
      reminderAt: body.reminderAt ? new Date(body.reminderAt) : undefined,
    });
  }

  @Get()
  async getDeadlines(
    @Request() req: BetterAuthRequest,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('jobId') jobId?: string,
  ) {
    return this.deadlinesService.getDeadlines(req.user?.userId ?? '', {
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      jobId,
    });
  }

  @Get('stats')
  async getStats(@Request() req: BetterAuthRequest) {
    return this.deadlinesService.getDeadlineStats(req.user?.userId ?? '');
  }

  @Get('upcoming')
  async getUpcoming(@Request() req: BetterAuthRequest, @Query('days') days?: string) {
    return this.deadlinesService.getUpcomingReminders(req.user?.userId ?? '', days ? parseInt(days) : 7);
  }

  @Get('overdue')
  async getOverdue(@Request() req: BetterAuthRequest) {
    return this.deadlinesService.getOverdueDeadlines(req.user?.userId ?? '');
  }

  @Get('calendar')
  async getCalendarView(
    @Request() req: BetterAuthRequest,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    return this.deadlinesService.getCalendarView(
      req.user?.userId ?? '',
      parseInt(year),
      parseInt(month),
    );
  }

  @Get(':id')
  async getDeadline(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    return this.deadlinesService.getDeadlineById(id, req.user?.userId ?? '');
  }

  @Patch(':id')
  async updateDeadline(
    @Request() req: BetterAuthRequest,
    @Param('id') id: string,
    @Body() body: Partial<{
      deadline: string;
      reminderAt: string;
      status: 'upcoming' | 'passed' | 'applied' | 'withdrawn';
      notes: string;
    }>,
  ) {
    const data: Record<string, unknown> = { ...body };
    if (data.deadline) data.deadline = new Date(data.deadline as string);
    if (data.reminderAt) data.reminderAt = new Date(data.reminderAt as string);
    return this.deadlinesService.updateDeadline(id, req.user?.userId ?? '', data);
  }

  @Patch(':id/reminder-sent')
  async markReminderSent(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    await this.deadlinesService.markReminderSent(id, req.user?.userId ?? '');
    return { success: true };
  }

  @Delete(':id')
  async deleteDeadline(@Request() req, @Param('id') id: string) {
    await this.deadlinesService.deleteDeadline(id, req.user.userId);
    return { success: true };
  }
}