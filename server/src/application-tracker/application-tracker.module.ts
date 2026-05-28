import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ApplicationTrackerController } from './application-tracker.controller';
import { ApplicationTrackerService } from './application-tracker.service';

@Module({
  imports: [PrismaModule],
  controllers: [ApplicationTrackerController],
  providers: [ApplicationTrackerService],
  exports: [ApplicationTrackerService],
})
export class ApplicationTrackerModule {}
