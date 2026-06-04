import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { InterviewProcessController } from './interview-process.controller';
import { InterviewProcessService } from './interview-process.service';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [InterviewProcessController],
  providers: [InterviewProcessService],
  exports: [InterviewProcessService],
})
export class InterviewProcessModule {}
