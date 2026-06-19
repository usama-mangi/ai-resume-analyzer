import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SessionGuard } from '../auth/guards/session.guard';
import { ResumesService } from './resumes.service';

@Controller('resumes')
@UseGuards(SessionGuard)
export class ResumesController {
  constructor(private resumesService: ResumesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 20 * 1024 * 1024 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('companyName') companyName: string,
    @Body('jobTitle') jobTitle: string,
    @Body('jobDescription') jobDescription: string,
  ) {
    return this.resumesService.create(
      req.user.userId,
      file,
      companyName,
      jobTitle,
      jobDescription || '',
    );
  }

  @Get()
  async findAll(@Request() req) {
    return this.resumesService.findAll(req.user.userId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.resumesService.findById(id, req.user.userId);
  }

  @Post('generate')
  async generateFromProfile(
    @Request() req,
    @Body() body: { targetRole?: string; jobDescription?: string },
  ) {
    return this.resumesService.generateFromProfile(req.user.userId, body);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    return this.resumesService.remove(id, req.user.userId);
  }

  @Patch(':id/content')
  async updateContent(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { generatedContent: any; contactInfo?: any },
  ) {
    return this.resumesService.updateContent(id, req.user.userId, body);
  }

  @Post(':id/analyze')
  async analyze(@Request() req, @Param('id') id: string) {
    return this.resumesService.analyze(id, req.user.userId);
  }

  @Get(':id/cover-letters/latest')
  async getLatestCoverLetter(@Request() req, @Param('id') id: string) {
    return this.resumesService.getLatestCoverLetter(id, req.user.userId);
  }

  @Post(':id/cover-letter')
  async generateCoverLetter(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { companyName: string; hiringManager?: string; additionalContext?: string },
  ) {
    return this.resumesService.generateCoverLetter(id, req.user.userId, body);
  }

  @Get(':id/skill-gap')
  async getSkillGap(@Request() req, @Param('id') id: string) {
    return this.resumesService.getSkillGap(id, req.user.userId);
  }

  @Post(':id/skill-gap')
  async analyzeSkillGap(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { jobDescription?: string },
  ) {
    return this.resumesService.analyzeSkillGap(id, req.user.userId, body);
  }

  @Get(':id/interview-questions')
  async getInterviewQuestions(@Request() req, @Param('id') id: string) {
    return this.resumesService.getInterviewQuestions(id, req.user.userId);
  }

  @Post(':id/interview-questions')
  async generateInterviewQuestions(
    @Request() req,
    @Param('id') id: string,
    @Body()
    body: {
      jobDescription?: string;
      questionCount?: number;
      focusAreas?: string;
    },
  ) {
    return this.resumesService.generateInterviewQuestions(
      id,
      req.user.userId,
      body,
    );
  }

  @Get(':id/salary-estimate')
  async getSalaryEstimate(@Request() req, @Param('id') id: string) {
    return this.resumesService.getSalaryEstimate(id, req.user.userId);
  }

  @Post(':id/salary-estimate')
  async estimateSalary(
    @Request() req,
    @Param('id') id: string,
    @Body()
    body: {
      targetLocation?: string;
      yearsOfExperience?: string;
      targetIndustry?: string;
    },
  ) {
    return this.resumesService.estimateSalary(id, req.user.userId, body);
  }

  @Get(':id/template-suggestions')
  async getTemplateSuggestions(@Request() req, @Param('id') id: string) {
    return this.resumesService.getTemplateSuggestions(id, req.user.userId);
  }

  @Post(':id/template-suggestions')
  async suggestTemplates(@Request() req, @Param('id') id: string) {
    return this.resumesService.suggestTemplates(id, req.user.userId);
  }

  @Get(':id/multi-jd')
  async getMultiJd(@Request() req, @Param('id') id: string) {
    return this.resumesService.getMultiJd(id, req.user.userId);
  }

  @Post(':id/multi-jd')
  async compareMultipleJds(
    @Request() req,
    @Param('id') id: string,
    @Body()
    body: { jobEntries: { title: string; description: string }[] },
  ) {
    return this.resumesService.compareMultipleJds(id, req.user.userId, body);
  }

  @Post(':id/share')
  async generateShareToken(@Request() req, @Param('id') id: string) {
    return this.resumesService.generateShareToken(id, req.user.userId);
  }

  @Get(':id/tip-feedback')
  async getTipFeedback(@Request() req, @Param('id') id: string) {
    return this.resumesService.getTipFeedback(id, req.user.userId);
  }

  @Post(':id/tip-feedback')
  async saveTipFeedback(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { key: string; value: 'up' | 'down' | null },
  ) {
    return this.resumesService.saveTipFeedback(id, req.user.userId, body.key, body.value);
  }

  @Patch(':id/status')
  async updateApplicationStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { status: string; notes?: string },
  ) {
    return this.resumesService.updateApplicationStatus(id, req.user.userId, body);
  }

  @Get(':id/tailored-resume')
  async getTailoredResume(@Request() req, @Param('id') id: string, @Query('jobId') jobId?: string) {
    return this.resumesService.getTailoredResume(id, req.user.userId, jobId);
  }

  @Post(':id/tailored-resume')
  async generateTailoredResume(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { jobDescription: string; targetRole?: string; jobId?: string },
  ) {
    return this.resumesService.generateTailoredResume(id, req.user.userId, body);
  }

  // Resume Version Management
  @Post(':id/versions')
  async createResumeVersion(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { name: string; description?: string; content: any; isPrimary?: boolean },
  ) {
    return this.resumesService.createResumeVersion(id, req.user.userId, body);
  }

  @Get(':id/versions')
  async getResumeVersions(@Request() req, @Param('id') id: string) {
    return this.resumesService.getResumeVersions(id, req.user.userId);
  }

  @Get('version/:versionId')
  async getResumeVersion(@Request() req, @Param('versionId') versionId: string) {
    return this.resumesService.getResumeVersion(versionId, req.user.userId);
  }

  @Patch('version/:versionId')
  async updateResumeVersion(
    @Request() req,
    @Param('versionId') versionId: string,
    @Body() body: { name?: string; description?: string; content?: any; isPrimary?: boolean },
  ) {
    return this.resumesService.updateResumeVersion(versionId, req.user.userId, body);
  }

  @Delete('version/:versionId')
  async deleteResumeVersion(@Request() req, @Param('versionId') versionId: string) {
    return this.resumesService.deleteResumeVersion(versionId, req.user.userId);
  }

  @Patch('version/:versionId/primary')
  async setPrimaryResumeVersion(@Request() req, @Param('versionId') versionId: string) {
    return this.resumesService.setPrimaryResumeVersion(versionId, req.user.userId);
  }
}