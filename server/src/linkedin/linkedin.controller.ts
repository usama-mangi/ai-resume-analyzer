import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SessionGuard } from '../auth/guards/session.guard';
import { LinkedInService } from './linkedin.service';

@Controller('linkedin')
@UseGuards(SessionGuard)
export class LinkedInController {
  constructor(private linkedinService: LinkedInService) {}

  @Post('analyze')
  async analyze(
    @Request() req,
    @Body()
    body: {
      profileText: string;
      profileUrl?: string;
      targetRole?: string;
    },
  ) {
    return this.linkedinService.analyze(req.user.userId, body);
  }

  @Get('profiles')
  async findAll(@Request() req) {
    return this.linkedinService.findAll(req.user.userId);
  }

  @Get('profiles/:id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.linkedinService.findById(id, req.user.userId);
  }

  @Delete('profiles/:id')
  async remove(@Request() req, @Param('id') id: string) {
    return this.linkedinService.remove(id, req.user.userId);
  }

  @Post('profiles/:id/reanalyze')
  async reanalyze(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { targetRole?: string },
  ) {
    return this.linkedinService.reanalyze(id, req.user.userId, body);
  }
}
