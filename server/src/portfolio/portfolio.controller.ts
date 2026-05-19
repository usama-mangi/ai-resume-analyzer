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
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
@UseGuards(SessionGuard)
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Post()
  async createPortfolio(
    @Request() req,
    @Body()
    body: {
      title: string;
      description: string;
      projectUrl?: string;
      githubUrl?: string;
      demoUrl?: string;
      technologies: string[];
      role?: string;
      startDate?: string;
      endDate?: string;
      isPublic?: boolean;
    },
  ) {
    return this.portfolioService.create(req.user.userId, {
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
    });
  }

  @Get()
  async getPortfolios(@Request() req) {
    return this.portfolioService.findAll(req.user.userId);
  }

  @Get(':id')
  async getPortfolio(@Request() req, @Param('id') id: string) {
    return this.portfolioService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  async updatePortfolio(
    @Request() req,
    @Param('id') id: string,
    @Body()
    body: Partial<{
      title: string;
      description: string;
      projectUrl: string;
      githubUrl: string;
      demoUrl: string;
      technologies: string[];
      role: string;
      startDate: string;
      endDate: string;
      isPublic: boolean;
    }>,
  ) {
    const data: any = { ...body };
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    return this.portfolioService.update(id, req.user.userId, data);
  }

  @Delete(':id')
  async deletePortfolio(@Request() req, @Param('id') id: string) {
    await this.portfolioService.remove(id, req.user.userId);
    return { success: true };
  }
}
