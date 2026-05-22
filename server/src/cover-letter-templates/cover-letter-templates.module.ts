import { Module } from '@nestjs/common';
import { CoverLetterTemplatesController } from './cover-letter-templates.controller';
import { CoverLetterTemplatesService } from './cover-letter-templates.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CoverLetterTemplatesController],
  providers: [CoverLetterTemplatesService],
  exports: [CoverLetterTemplatesService],
})
export class CoverLetterTemplatesModule {}
