import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SessionGuard } from '../auth/guards/session.guard';
import { BatchesService } from './batches.service';

@Controller('batches')
@UseGuards(SessionGuard)
export class BatchesController {
  constructor(private batchesService: BatchesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 20))
  async create(
    @Request() req,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 20 * 1024 * 1024 }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Body('companyName') companyName: string,
    @Body('jobTitle') jobTitle: string,
    @Body('jobDescription') jobDescription: string,
  ) {
    return this.batchesService.create(
      req.user.userId,
      files,
      companyName,
      jobTitle,
      jobDescription || '',
    );
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.batchesService.findById(id, req.user.userId);
  }
}