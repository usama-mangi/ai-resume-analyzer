import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { InterviewPrepController } from './interview-prep.controller';
import { InterviewPrepService } from './interview-prep.service';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [InterviewPrepController],
  providers: [InterviewPrepService],
  exports: [InterviewPrepService],
})
export class InterviewPrepModule {}
