import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ResumesService } from './resumes.service';

@Controller('share')
export class ShareController {
  constructor(private resumesService: ResumesService) {}

  @Get(':token')
  async getSharedReport(@Param('token') token: string) {
    return this.resumesService.getReportByToken(token);
  }

  @Post(':token/feedback')
  async submitFeedback(
    @Param('token') token: string,
    @Body() body: { name: string; comment: string; rating?: number },
  ) {
    return this.resumesService.submitSharedFeedback(token, body);
  }
}
