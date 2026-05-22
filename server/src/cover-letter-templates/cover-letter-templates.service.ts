import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CoverLetterTemplate } from '@prisma/client';

export interface CreateTemplateDto {
  name: string;
  description?: string;
  template: string;
  isDefault?: boolean;
}

export interface UpdateTemplateDto {
  name?: string;
  description?: string;
  template?: string;
  isDefault?: boolean;
}

@Injectable()
export class CoverLetterTemplatesService {
  private readonly logger = new Logger(CoverLetterTemplatesService.name);

  constructor(private prisma: PrismaService) {}

  async createTemplate(
    userId: string,
    data: CreateTemplateDto,
  ): Promise<CoverLetterTemplate> {
    // If this template is marked as default, unset any existing default
    if (data.isDefault) {
      await this.prisma.coverLetterTemplate.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const template = await this.prisma.coverLetterTemplate.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        template: data.template,
        isDefault: data.isDefault ?? false,
      },
    });

    this.logger.log(
      `Created cover letter template "${template.name}" for user ${userId}`,
    );
    return template;
  }

  async getTemplates(userId: string): Promise<CoverLetterTemplate[]> {
    return this.prisma.coverLetterTemplate.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
    });
  }

  async getTemplateById(
    id: string,
    userId: string,
  ): Promise<CoverLetterTemplate> {
    const template = await this.prisma.coverLetterTemplate.findFirst({
      where: { id, userId },
    });

    if (!template) {
      throw new NotFoundException('Cover letter template not found');
    }

    return template;
  }

  async updateTemplate(
    id: string,
    userId: string,
    data: UpdateTemplateDto,
  ): Promise<CoverLetterTemplate> {
    const existing = await this.prisma.coverLetterTemplate.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Cover letter template not found');
    }

    // If setting as default, unset any existing default first
    if (data.isDefault) {
      await this.prisma.coverLetterTemplate.updateMany({
        where: { userId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const updated = await this.prisma.coverLetterTemplate.update({
      where: { id },
      data,
    });

    this.logger.log(
      `Updated cover letter template "${updated.name}" for user ${userId}`,
    );
    return updated;
  }

  async deleteTemplate(id: string, userId: string): Promise<void> {
    const existing = await this.prisma.coverLetterTemplate.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Cover letter template not found');
    }

    await this.prisma.coverLetterTemplate.delete({ where: { id } });

    this.logger.log(
      `Deleted cover letter template "${existing.name}" for user ${userId}`,
    );
  }

  async applyTemplate(
    id: string,
    userId: string,
    variables: Record<string, string>,
  ): Promise<{ rendered: string }> {
    const template = await this.getTemplateById(id, userId);

    // Replace all {{variableName}} placeholders with provided values
    const rendered = template.template.replace(
      /\{\{(\w+)\}\}/g,
      (match, key) => {
        if (key in variables && variables[key] !== undefined) {
          return variables[key];
        }
        // Leave unmatched placeholders as-is
        return match;
      },
    );

    return { rendered };
  }

  async setDefault(id: string, userId: string): Promise<CoverLetterTemplate> {
    const existing = await this.prisma.coverLetterTemplate.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Cover letter template not found');
    }

    // Unset all current defaults for this user
    await this.prisma.coverLetterTemplate.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    // Set the new default
    const updated = await this.prisma.coverLetterTemplate.update({
      where: { id },
      data: { isDefault: true },
    });

    this.logger.log(
      `Set "${updated.name}" as default template for user ${userId}`,
    );
    return updated;
  }
}
