import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SessionGuard } from '../auth/guards/session.guard';
import { PostOnboardingService } from './post-onboarding.service';
import { BetterAuthRequest } from '../common/types';

@Controller('post-onboarding')
@UseGuards(SessionGuard)
export class PostOnboardingController {
  constructor(private service: PostOnboardingService) {}

  // ─── 30-60-90 Day Plan Builder ───

  @Post('plans')
  async createPlan(@Request() req: BetterAuthRequest, @Body() body: any) {
    return this.service.createOnboardingPlan(req.user?.userId ?? '', body);
  }

  @Get('plans')
  async listPlans(@Request() req: BetterAuthRequest) {
    return this.service.listOnboardingPlans(req.user?.userId ?? '');
  }

  @Get('plans/:id')
  async getPlan(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    return this.service.getOnboardingPlan(req.user?.userId ?? '', id);
  }

  @Delete('plans/:id')
  async deletePlan(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    await this.service.deleteOnboardingPlan(req.user?.userId ?? '', id);
    return { success: true };
  }

  // ─── Onboarding Checklist ───

  @Post('checklists')
  async createChecklist(@Request() req: BetterAuthRequest, @Body() body: any) {
    return this.service.createOnboardingChecklist(req.user?.userId ?? '', body);
  }

  @Get('checklists')
  async listChecklists(@Request() req: BetterAuthRequest) {
    return this.service.listOnboardingChecklists(req.user?.userId ?? '');
  }

  @Get('checklists/:id')
  async getChecklist(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    return this.service.getOnboardingChecklist(req.user?.userId ?? '', id);
  }

  @Patch('checklists/:id/items')
  async updateChecklistItem(@Request() req: BetterAuthRequest, @Param('id') id: string, @Body() body: any) {
    return this.service.updateChecklistItem(req.user?.userId ?? '', id, body);
  }

  @Delete('checklists/:id')
  async deleteChecklist(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    await this.service.deleteOnboardingChecklist(req.user?.userId ?? '', id);
    return { success: true };
  }

  // ─── Manager Alignment Tool ───

  @Post('alignments')
  async createAlignment(@Request() req: BetterAuthRequest, @Body() body: any) {
    return this.service.createManagerAlignment(req.user?.userId ?? '', body);
  }

  @Get('alignments')
  async listAlignments(@Request() req: BetterAuthRequest) {
    return this.service.listManagerAlignments(req.user?.userId ?? '');
  }

  @Get('alignments/:id')
  async getAlignment(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    return this.service.getManagerAlignment(req.user?.userId ?? '', id);
  }

  @Delete('alignments/:id')
  async deleteAlignment(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    await this.service.deleteManagerAlignment(req.user?.userId ?? '', id);
    return { success: true };
  }

  // ─── Network Mapping ───

  @Post('networks')
  async createNetwork(@Request() req: BetterAuthRequest, @Body() body: any) {
    return this.service.createNetworkMap(req.user?.userId ?? '', body);
  }

  @Get('networks')
  async listNetworks(@Request() req: BetterAuthRequest) {
    return this.service.listNetworkMaps(req.user?.userId ?? '');
  }

  @Get('networks/:id')
  async getNetwork(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    return this.service.getNetworkMap(req.user?.userId ?? '', id);
  }

  @Delete('networks/:id')
  async deleteNetwork(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    await this.service.deleteNetworkMap(req.user?.userId ?? '', id);
    return { success: true };
  }

  // ─── Skill Refresh Recommendations ───

  @Post('skills')
  async createSkill(@Request() req: BetterAuthRequest, @Body() body: any) {
    return this.service.createSkillRefresh(req.user?.userId ?? '', body);
  }

  @Get('skills')
  async listSkills(@Request() req: BetterAuthRequest) {
    return this.service.listSkillRefreshes(req.user?.userId ?? '');
  }

  @Get('skills/:id')
  async getSkill(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    return this.service.getSkillRefresh(req.user?.userId ?? '', id);
  }

  @Delete('skills/:id')
  async deleteSkill(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    await this.service.deleteSkillRefresh(req.user?.userId ?? '', id);
    return { success: true };
  }

  // ─── First 90 Days Tracker ───

  @Post('trackers')
  async createTracker(@Request() req: BetterAuthRequest, @Body() body: any) {
    return this.service.createFirst90DaysTracker(req.user?.userId ?? '', body);
  }

  @Get('trackers')
  async listTrackers(@Request() req: BetterAuthRequest) {
    return this.service.listFirst90DaysTrackers(req.user?.userId ?? '');
  }

  @Get('trackers/:id')
  async getTracker(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    return this.service.getFirst90DaysTracker(req.user?.userId ?? '', id);
  }

  @Patch('trackers/:id')
  async updateTracker(@Request() req: BetterAuthRequest, @Param('id') id: string, @Body() body: any) {
    return this.service.updateFirst90DaysTracker(req.user?.userId ?? '', id, body);
  }

  @Delete('trackers/:id')
  async deleteTracker(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    await this.service.deleteFirst90DaysTracker(req.user?.userId ?? '', id);
    return { success: true };
  }
}
