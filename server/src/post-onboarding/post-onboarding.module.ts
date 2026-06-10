import { Module } from '@nestjs/common';
import { PostOnboardingController } from './post-onboarding.controller';
import { PostOnboardingService } from './post-onboarding.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [PostOnboardingController],
  providers: [PostOnboardingService],
  exports: [PostOnboardingService],
})
export class PostOnboardingModule {}
