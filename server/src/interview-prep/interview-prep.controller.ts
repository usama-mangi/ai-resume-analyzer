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
import { InterviewPrepService } from './interview-prep.service';
import { BetterAuthRequest } from '../common/types';

@Controller('interview-prep')
@UseGuards(SessionGuard)
export class InterviewPrepController {
  constructor(private prepService: InterviewPrepService) {}

  // Company Briefing
  @Post('briefing')
  async generateBriefing(@Request() req: BetterAuthRequest, @Body() body: any) {
    return this.prepService.generateCompanyBriefing(req.user?.userId ?? '', body);
  }

  @Get('briefings')
  async listBriefings(@Request() req: BetterAuthRequest) {
    return this.prepService.getCompanyBriefings(req.user?.userId ?? '');
  }

  @Get('briefing/:id')
  async getBriefing(@Request() req: any, @Param('id') id: string) {
    return this.prepService.getCompanyBriefing(req.user.userId, id);
  }

  @Delete('briefing/:id')
  async deleteBriefing(@Request() req: any, @Param('id') id: string) {
    await this.prepService.deleteCompanyBriefing(req.user.userId, id);
    return { success: true };
  }

  // Technical Assessment
  @Post('technical')
  async generateTechnical(@Request() req: any, @Body() body: any) {
    return this.prepService.generateTechnicalAssessment(req.user.userId, body);
  }

  @Get('technicals')
  async listTechnicals(@Request() req: any) {
    return this.prepService.getTechnicalPractices(req.user.userId);
  }

  @Get('technical/:id')
  async getTechnical(@Request() req: any, @Param('id') id: string) {
    return this.prepService.getTechnicalPractice(req.user.userId, id);
  }

  @Delete('technical/:id')
  async deleteTechnical(@Request() req: any, @Param('id') id: string) {
    await this.prepService.deleteTechnicalPractice(req.user.userId, id);
    return { success: true };
  }

  // Behavioral Bank
  @Post('behavioral')
  async generateBehavioral(@Request() req: any, @Body() body: any) {
    return this.prepService.generateBehavioralBank(req.user.userId, body);
  }

  @Get('behaviorals')
  async listBehaviorals(@Request() req: any) {
    return this.prepService.getBehavioralBanks(req.user.userId);
  }

  @Get('behavioral/:id')
  async getBehavioral(@Request() req: any, @Param('id') id: string) {
    return this.prepService.getBehavioralBank(req.user.userId, id);
  }

  @Delete('behavioral/:id')
  async deleteBehavioral(@Request() req: any, @Param('id') id: string) {
    await this.prepService.deleteBehavioralBank(req.user.userId, id);
    return { success: true };
  }

  // Mock Interview
  @Post('mock-interview')
  async createMockInterview(@Request() req: any, @Body() body: any) {
    return this.prepService.createMockInterview(req.user.userId, body);
  }

  @Get('mock-interviews')
  async listMockInterviews(@Request() req: any) {
    return this.prepService.getMockInterviews(req.user.userId);
  }

  @Get('mock-interview/:id')
  async getMockInterview(@Request() req: any, @Param('id') id: string) {
    return this.prepService.getMockInterview(req.user.userId, id);
  }

  @Post('mock-interview/:id/message')
  async sendMockMessage(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { message: string },
  ) {
    return this.prepService.sendMockInterviewMessage(req.user.userId, id, body.message);
  }

  @Delete('mock-interview/:id')
  async deleteMockInterview(@Request() req: any, @Param('id') id: string) {
    await this.prepService.deleteMockInterview(req.user.userId, id);
    return { success: true };
  }

  // Cheat Sheet
  @Post('cheat-sheet')
  async generateCheatSheet(@Request() req: any, @Body() body: any) {
    return this.prepService.generateCheatSheet(req.user.userId, body);
  }

  @Get('cheat-sheets')
  async listCheatSheets(@Request() req: any) {
    return this.prepService.getCheatSheets(req.user.userId);
  }

  @Get('cheat-sheet/:id')
  async getCheatSheet(@Request() req: any, @Param('id') id: string) {
    return this.prepService.getCheatSheet(req.user.userId, id);
  }

  @Delete('cheat-sheet/:id')
  async deleteCheatSheet(@Request() req: any, @Param('id') id: string) {
    await this.prepService.deleteCheatSheet(req.user.userId, id);
    return { success: true };
  }

  // Interview Scheduling
  @Post('schedule')
  async createSchedule(@Request() req: any, @Body() body: any) {
    return this.prepService.createScheduleEntry(req.user.userId, body);
  }

  @Get('schedule')
  async listSchedule(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.prepService.getScheduleEntries(req.user.userId, { status, startDate, endDate });
  }

  @Get('schedule/upcoming')
  async getUpcoming(@Request() req: any) {
    return this.prepService.getUpcomingInterviews(req.user.userId);
  }

  @Get('schedule/:id')
  async getScheduleEntry(@Request() req: any, @Param('id') id: string) {
    return this.prepService.getScheduleEntry(req.user.userId, id);
  }

  @Patch('schedule/:id')
  async updateSchedule(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.prepService.updateScheduleEntry(req.user.userId, id, body);
  }

  @Delete('schedule/:id')
  async deleteSchedule(@Request() req: any, @Param('id') id: string) {
    await this.prepService.deleteScheduleEntry(req.user.userId, id);
    return { success: true };
  }
}
