import { Module } from '@nestjs/common';
import { ResumesController } from './resumes.controller';
import { ShareController } from './share.controller';
import { ResumesService } from './resumes.service';
import { ResumeParserService } from './resume-parser.service';
import { PdfToImageService } from './pdf-to-image.service';
import { UploadModule } from '../upload/upload.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [UploadModule, AiModule],
  controllers: [ResumesController, ShareController],
  providers: [ResumesService, ResumeParserService, PdfToImageService],
  exports: [ResumesService],
})
export class ResumesModule {}
