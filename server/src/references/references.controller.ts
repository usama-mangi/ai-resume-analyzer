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
import {
  ReferencesService,
  CreateReferenceDto,
  UpdateReferenceDto,
  ReferenceStatus,
} from './references.service';

@Controller('references')
@UseGuards(SessionGuard)
export class ReferencesController {
  constructor(private referencesService: ReferencesService) {}

  @Post()
  async createReference(
    @Request() req,
    @Body() body: CreateReferenceDto,
  ) {
    return this.referencesService.createReference(req.user.userId, body);
  }

  @Get()
  async getReferences(@Request() req) {
    return this.referencesService.getReferences(req.user.userId);
  }

  @Get(':id')
  async getReference(@Request() req, @Param('id') id: string) {
    return this.referencesService.getReferenceById(id, req.user.userId);
  }

  @Patch(':id')
  async updateReference(
    @Request() req,
    @Param('id') id: string,
    @Body() body: UpdateReferenceDto,
  ) {
    return this.referencesService.updateReference(id, req.user.userId, body);
  }

  @Delete(':id')
  async deleteReference(@Request() req, @Param('id') id: string) {
    await this.referencesService.deleteReference(id, req.user.userId);
    return { success: true };
  }

  @Patch(':id/status')
  async updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { status: ReferenceStatus },
  ) {
    return this.referencesService.updateStatus(id, req.user.userId, body.status);
  }
}
