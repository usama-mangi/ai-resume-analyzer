import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SessionGuard } from '../auth/guards/session.guard';
import { ExtensionService } from './extension.service';
import { BetterAuthRequest } from '../common/types';

@Controller('extension')
export class ExtensionController {
  constructor(private extensionService: ExtensionService) {}

  @Get('profile')
  @UseGuards(SessionGuard)
  async getProfile(@Request() req: BetterAuthRequest) {
    return this.extensionService.getUserProfile(req.user?.userId ?? '');
  }

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string }) {
    return this.extensionService.authenticateExtensionUser(body.email, body.password);
  }

  @Post('auth/clerk')
  @HttpCode(HttpStatus.OK)
  async clerkAuth(@Body() body: { clerkToken: string }) {
    return { accessToken: body.clerkToken, userId: 'clerk-user' };
  }

  @Post('applications')
  @UseGuards(SessionGuard)
  async createApplication(@Request() req: BetterAuthRequest, @Body() body: any) {
    return this.extensionService.createApplicationBundle(req.user?.userId ?? '', {
      ...body,
      companyName: body.companyName || 'Unknown Company',
      roleTitle: body.roleTitle || 'Unknown Role',
    });
  }

  @Get('applications')
  @UseGuards(SessionGuard)
  async getApplications(@Request() req: BetterAuthRequest, @Query('status') status?: string) {
    return this.extensionService.getApplicationBundles(req.user?.userId ?? '', { status });
  }

  @Get('applications/:id')
  @UseGuards(SessionGuard)
  async getApplication(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    return this.extensionService.getApplicationBundle(req.user?.userId ?? '', id);
  }

  @Patch('applications/:id')
  @UseGuards(SessionGuard)
  async updateApplication(@Request() req: BetterAuthRequest, @Param('id') id: string, @Body() body: any) {
    return this.extensionService.updateApplicationBundle(req.user?.userId ?? '', id, body);
  }

  @Delete('applications/:id')
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteApplication(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    await this.extensionService.deleteApplicationBundle(req.user?.userId ?? '', id);
  }

  @Post('applications/:id/comms')
  @UseGuards(SessionGuard)
  async addCommLog(@Request() req: BetterAuthRequest, @Param('id') id: string, @Body() body: any) {
    return this.extensionService.addCommunicationLog(req.user?.userId ?? '', {
      ...body,
      applicationId: id,
    });
  }

  @Get('applications/:id/comms')
  @UseGuards(SessionGuard)
  async getCommLogs(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    return this.extensionService.getCommunicationLogs(req.user?.userId ?? '', id);
  }

  @Post('applications/:id/referral')
  @UseGuards(SessionGuard)
  async upsertReferral(@Request() req: BetterAuthRequest, @Param('id') id: string, @Body() body: any) {
    return this.extensionService.upsertReferral(req.user?.userId ?? '', {
      ...body,
      applicationId: id,
    });
  }

  @Get('applications/:id/referral')
  @UseGuards(SessionGuard)
  async getReferral(@Request() req: BetterAuthRequest, @Param('id') id: string) {
    return this.extensionService.getReferral(req.user?.userId ?? '', id);
  }

  @Get('applications/analytics')
  @UseGuards(SessionGuard)
  async getAnalytics(
    @Request() req: BetterAuthRequest,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.extensionService.getApplicationAnalytics(req.user?.userId ?? '', { startDate, endDate });
  }
}
