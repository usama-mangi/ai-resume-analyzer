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
import { JobsService, JobSearchParams } from './jobs.service';

interface SavedSearchInput {
  name: string;
  keywords: string[];
  location?: string;
  jobTypes?: string[];
  remoteTypes?: string[];
  experienceLevels?: string[];
  sources?: string[];
  isActive?: boolean;
}

@Controller('jobs')
@UseGuards(SessionGuard)
export class JobsController {
  constructor(private jobsService: JobsService) {}

  // ─── Static routes first (before parameterized /:id) ───

  @Post('search')
  async searchJobs(
    @Request() req,
    @Body() params: JobSearchParams,
  ) {
    const result = await this.jobsService.searchJobs(req.user.userId, params);
    return result;
  }

  @Get()
  async getJobs(
    @Request() req,
    @Query('source') source?: string,
    @Query('isBookmarked') isBookmarked?: string,
    @Query('search') search?: string,
    @Query('jobType') jobType?: string,
    @Query('remoteType') remoteType?: string,
    @Query('experienceLevel') experienceLevel?: string,
    @Query('jobFunction') jobFunction?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.jobsService.getJobs(req.user.userId, {
      source,
      isBookmarked: isBookmarked === 'true' ? true : isBookmarked === 'false' ? false : undefined,
      search,
      jobType,
      remoteType,
      experienceLevel,
      jobFunction,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Post('batch-match')
  async batchMatchJobs(
    @Request() req,
    @Body() body: { jobIds: string[]; resumeId: string },
  ) {
    return this.jobsService.batchMatchJobs(req.user.userId, body.jobIds, body.resumeId);
  }

  @Post('bookmarked')
  async checkBookmarked(
    @Request() req,
    @Body() body: { ids: string[] },
  ) {
    return this.jobsService.checkBookmarked(req.user.userId, body.ids);
  }

  @Post('clear')
  async clearJobs(@Request() req) {
    await this.jobsService.clearUserJobs(req.user.userId);
    return { success: true };
  }

  // ─── Saved searches (static, before /:id) ───

  @Post('searches')
  async createSavedSearch(
    @Request() req,
    @Body() body: SavedSearchInput,
  ) {
    return this.jobsService.createSavedSearch(req.user.userId, body);
  }

  @Get('searches')
  async getSavedSearches(@Request() req) {
    return this.jobsService.getSavedSearches(req.user.userId);
  }

  @Patch('searches/:id')
  async updateSavedSearch(
    @Request() req,
    @Param('id') id: string,
    @Body() body: Partial<SavedSearchInput>,
  ) {
    return this.jobsService.updateSavedSearch(id, req.user.userId, body);
  }

  @Delete('searches/:id')
  async deleteSavedSearch(@Request() req, @Param('id') id: string) {
    return this.jobsService.deleteSavedSearch(id, req.user.userId);
  }

  @Post('searches/:id/run')
  async runSavedSearch(@Request() req, @Param('id') id: string) {
    return this.jobsService.runSavedSearch(id, req.user.userId);
  }

  // ─── Parameterized routes (after all static routes) ───

  @Get(':id')
  async getJob(@Request() req, @Param('id') id: string) {
    return this.jobsService.getJobById(id, req.user.userId);
  }

  @Get(':id/details')
  async getJobDetails(@Request() req, @Param('id') id: string) {
    return this.jobsService.getJobDetails(id, req.user.userId);
  }

  @Patch(':id/bookmark')
  async toggleBookmark(@Request() req, @Param('id') id: string) {
    return this.jobsService.toggleBookmark(id, req.user.userId);
  }

  @Post(':id/tags')
  async addTags(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { tags: string[] },
  ) {
    return this.jobsService.addTags(id, req.user.userId, body.tags);
  }

  @Delete(':id/tags/:tag')
  async removeTag(
    @Request() req,
    @Param('id') id: string,
    @Param('tag') tag: string,
  ) {
    return this.jobsService.removeTag(id, req.user.userId, tag);
  }

  @Patch(':id/applied')
  async markAsApplied(@Request() req, @Param('id') id: string) {
    return this.jobsService.markAsApplied(id, req.user.userId);
  }

  @Post(':id/match')
  async analyzeJobMatch(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { resumeId: string },
  ) {
    return this.jobsService.analyzeJobMatch(req.user.userId, id, body.resumeId);
  }
}
