import { Module } from '@nestjs/common';
import { BatchesController } from './batches.controller';
import { BatchesService } from './batches.service';
import { UploadModule } from '../upload/upload.module';
import { AiModule } from '../ai/ai.module';
import { ResumeParserService } from '../resumes/resume-parser.service';
import { PdfToImageService } from '../resumes/pdf-to-image.service';

@Module({
  imports: [UploadModule, AiModule],
  controllers: [BatchesController],
  providers: [BatchesService, ResumeParserService, PdfToImageService],
})
export class BatchesModule {}