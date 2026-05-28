import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SessionGuard } from '../auth/guards/session.guard';
import {
  ApplicationTrackerService,
  ApplicationStatus,
} from './application-tracker.service';
import { BetterAuthRequest } from '../common/types';

@Controller('applications')
@UseGuards(SessionGuard)
export class ApplicationTrackerController {
  constructor(private trackerService: ApplicationTrackerService) {}

  @Post()
  async create(@Request() req: BetterAuthRequest, @Body() body: any) {
    return this.trackerService.create(req.user?.userId ?? '', body);
  }

  @Get()
  async list(
    @Request() req: BetterAuthRequest,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.trackerService.list(req.user?.userId ?? '', {
      status,
      startDate,
      endDate,
      search,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('pipeline')
  async getPipeline(@Request() req: BetterAuthRequest) {
    return this.trackerService.getPipeline(req.user?.userId ?? '');
  }

  @Get('analytics')
  async getAnalytics(
    @Request() req: BetterAuthRequest,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.trackerService.getAnalytics(req.user?.userId ?? '', { startDate, endDate });
  }

  @Get(':id')
  async getById(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    return this.trackerService.getById(req.user?.userId ?? '', id);
  }

  @Patch(':id')
  async update(@Request() req: BetterAuthRequest, @Param('id') id: string, @Body() body: any) {
    return this.trackerService.update(req.user?.userId ?? '', id, body);
  }

  @Delete(':id')
  async delete(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    await this.trackerService.delete(req.user?.userId ?? '', id);
    return { success: true };
  }

  @Patch(':id/status')
  async updateStatus(
    @Request() req: BetterAuthRequest,
    @Param('id') id: string,
    @Body() body: { status: ApplicationStatus },
  ) {
    return this.trackerService.updateStatus(req.user?.userId ?? '', id, body.status);
  }

  @Post(':id/comms')
  async addCommLog(@Request() req: BetterAuthRequest, @Param('id') id: string, @Body() body: any) {
    return this.trackerService.addCommunicationLog(req.user?.userId ?? '', id, body);
  }

  @Get(':id/comms')
  async getCommLogs(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    return this.trackerService.getCommunicationLogs(req.user?.userId ?? '', id);
  }

  @Post(':id/referral')
  async upsertReferral(@Request() req: BetterAuthRequest, @Param('id') id: string, @Body() body: any) {
    return this.trackerService.upsertReferral(req.user?.userId ?? '', id, body);
  }

  @Get(':id/referral')
  async getReferral(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    return this.trackerService.getReferral(req.user?.userId ?? '', id);
  }
}
