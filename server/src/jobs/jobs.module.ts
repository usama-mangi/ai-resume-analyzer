import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { SearchAlertProcessor } from './processor/search-alert.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AiModule,
    RedisModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST') || 'localhost',
          port: configService.get<number>('REDIS_PORT') || 6379,
          password: configService.get<string>('REDIS_PASSWORD') || undefined,
        },
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'search-alerts',
    }),
  ],
  controllers: [JobsController],
  providers: [JobsService, SearchAlertProcessor],
  exports: [JobsService],
})
export class JobsModule {}