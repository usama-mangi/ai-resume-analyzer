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
import { CoverLetterTemplatesService } from './cover-letter-templates.service';
import { CoverLetterTemplate } from '@prisma/client';

@Controller('cover-letter-templates')
@UseGuards(SessionGuard)
export class CoverLetterTemplatesController {
  constructor(
    private coverLetterTemplatesService: CoverLetterTemplatesService,
  ) {}

  @Post()
  async createTemplate(
    @Request() req,
    @Body()
    body: {
      name: string;
      description?: string;
      template: string;
      isDefault?: boolean;
    },
  ): Promise<CoverLetterTemplate> {
    return this.coverLetterTemplatesService.createTemplate(
      req.user.userId,
      body,
    );
  }

  @Get()
  async getTemplates(@Request() req): Promise<CoverLetterTemplate[]> {
    return this.coverLetterTemplatesService.getTemplates(req.user.userId);
  }

  @Get(':id')
  async getTemplate(
    @Request() req,
    @Param('id') id: string,
  ): Promise<CoverLetterTemplate> {
    return this.coverLetterTemplatesService.getTemplateById(
      id,
      req.user.userId,
    );
  }

  @Patch(':id')
  async updateTemplate(
    @Request() req,
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      description?: string;
      template?: string;
      isDefault?: boolean;
    },
  ): Promise<CoverLetterTemplate> {
    return this.coverLetterTemplatesService.updateTemplate(
      id,
      req.user.userId,
      body,
    );
  }

  @Delete(':id')
  async deleteTemplate(
    @Request() req,
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    await this.coverLetterTemplatesService.deleteTemplate(
      id,
      req.user.userId,
    );
    return { success: true };
  }

  @Post(':id/apply')
  async applyTemplate(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { variables: Record<string, string> },
  ): Promise<{ rendered: string }> {
    return this.coverLetterTemplatesService.applyTemplate(
      id,
      req.user.userId,
      body.variables,
    );
  }

  @Patch(':id/set-default')
  async setDefault(
    @Request() req,
    @Param('id') id: string,
  ): Promise<CoverLetterTemplate> {
    return this.coverLetterTemplatesService.setDefault(
      id,
      req.user.userId,
    );
  }
}
