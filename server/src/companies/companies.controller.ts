import { Controller, Get, Query, UseGuards, Request, Param } from '@nestjs/common';
import { SessionGuard } from '../auth/guards/session.guard';
import { CompaniesService } from './companies.service';
import { BetterAuthRequest } from '../common/types';

@Controller('companies')
@UseGuards(SessionGuard)
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get('research/:companyName')
  async getCompanyResearch(@Request() req: BetterAuthRequest, @Param('companyName') companyName: string) {
    return this.companiesService.getCompanyResearch(decodeURIComponent(companyName), req.user?.userId ?? '');
  }

  @Get('research')
  async getCompanyResearchList(
    @Request() req: BetterAuthRequest,
    @Query('search') search?: string,
    @Query('industry') industry?: string,
  ) {
    return this.companiesService.getCompanyResearchList(req.user?.userId ?? '', { search, industry });
  }
}