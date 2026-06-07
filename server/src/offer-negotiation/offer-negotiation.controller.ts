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
import { OfferNegotiationService } from './offer-negotiation.service';
import { BetterAuthRequest } from '../common/types';

@Controller('offer-negotiation')
@UseGuards(SessionGuard)
export class OfferNegotiationController {
  constructor(private service: OfferNegotiationService) {}

  // ─── Offer Comparison ───

  @Post('comparisons')
  async createComparison(@Request() req: BetterAuthRequest, @Body() body: any) {
    return this.service.createComparison(req.user?.userId ?? '', body);
  }

  @Get('comparisons')
  async listComparisons(@Request() req: BetterAuthRequest) {
    return this.service.listComparisons(req.user?.userId ?? '');
  }

  @Get('comparisons/:id')
  async getComparison(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    return this.service.getComparison(req.user?.userId ?? '', id);
  }

  @Delete('comparisons/:id')
  async deleteComparison(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    await this.service.deleteComparison(req.user?.userId ?? '', id);
    return { success: true };
  }

  // ─── Negotiation Coach ───

  @Post('coaches')
  async createCoach(@Request() req: BetterAuthRequest, @Body() body: any) {
    return this.service.createCoach(req.user?.userId ?? '', body);
  }

  @Get('coaches')
  async listCoaches(@Request() req: BetterAuthRequest) {
    return this.service.listCoaches(req.user?.userId ?? '');
  }

  @Get('coaches/:id')
  async getCoach(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    return this.service.getCoach(req.user?.userId ?? '', id);
  }

  @Delete('coaches/:id')
  async deleteCoach(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    await this.service.deleteCoach(req.user?.userId ?? '', id);
    return { success: true };
  }

  // ─── Equity Calculator ───

  @Post('equity/calculate')
  async calculateEquity(@Request() req: BetterAuthRequest, @Body() body: any) {
    return this.service.calculateEquity(req.user?.userId ?? '', body);
  }

  // ─── Benefits Analyzer ───

  @Post('benefits/analyze')
  async analyzeBenefits(@Request() req: BetterAuthRequest, @Body() body: any) {
    return this.service.analyzeBenefits(req.user?.userId ?? '', body);
  }

  // ─── Decision Framework ───

  @Post('decisions')
  async createDecision(@Request() req: BetterAuthRequest, @Body() body: any) {
    return this.service.createDecision(req.user?.userId ?? '', body);
  }

  @Get('decisions')
  async listDecisions(@Request() req: BetterAuthRequest) {
    return this.service.listDecisions(req.user?.userId ?? '');
  }

  @Get('decisions/:id')
  async getDecision(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    return this.service.getDecision(req.user?.userId ?? '', id);
  }

  @Delete('decisions/:id')
  async deleteDecision(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    await this.service.deleteDecision(req.user?.userId ?? '', id);
    return { success: true };
  }

  // ─── Resignation Letter ───

  @Post('resignation-letters')
  async generateResignationLetter(@Request() req: BetterAuthRequest, @Body() body: any) {
    return this.service.generateResignationLetter(req.user?.userId ?? '', body);
  }

  @Get('resignation-letters')
  async listResignationLetters(@Request() req: BetterAuthRequest) {
    return this.service.listResignationLetters(req.user?.userId ?? '');
  }

  @Get('resignation-letters/:id')
  async getResignationLetter(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    return this.service.getResignationLetter(req.user?.userId ?? '', id);
  }

  @Delete('resignation-letters/:id')
  async deleteResignationLetter(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    await this.service.deleteResignationLetter(req.user?.userId ?? '', id);
    return { success: true };
  }
}
