import { Controller, Get, Param } from '@nestjs/common';
import { ResumesService } from './resumes.service';

@Controller('share')
export class ShareController {
  constructor(private resumesService: ResumesService) {}

  @Get(':token')
  async getSharedReport(@Param('token') token: string) {
    return this.resumesService.getReportByToken(token);
  }
}
