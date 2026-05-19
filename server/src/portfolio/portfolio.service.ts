import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Portfolio } from '@prisma/client';

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    data: {
      title: string;
      description: string;
      projectUrl?: string;
      githubUrl?: string;
      demoUrl?: string;
      technologies: string[];
      role?: string;
      startDate?: Date;
      endDate?: Date;
      isPublic?: boolean;
    },
  ): Promise<Portfolio> {
    return this.prisma.portfolio.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        projectUrl: data.projectUrl,
        githubUrl: data.githubUrl,
        demoUrl: data.demoUrl,
        technologies: data.technologies,
        role: data.role,
        startDate: data.startDate,
        endDate: data.endDate,
        isPublic: data.isPublic ?? true,
      },
    });
  }

  async findAll(userId: string): Promise<Portfolio[]> {
    return this.prisma.portfolio.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Portfolio> {
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { id, userId },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio project not found');
    }

    return portfolio;
  }

  async update(
    id: string,
    userId: string,
    data: Partial<{
      title: string;
      description: string;
      projectUrl: string;
      githubUrl: string;
      demoUrl: string;
      technologies: string[];
      role: string;
      startDate: Date;
      endDate: Date;
      isPublic: boolean;
    }>,
  ): Promise<Portfolio> {
    const existing = await this.prisma.portfolio.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Portfolio project not found');
    }

    return this.prisma.portfolio.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    const existing = await this.prisma.portfolio.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Portfolio project not found');
    }

    await this.prisma.portfolio.delete({ where: { id } });
  }
}
