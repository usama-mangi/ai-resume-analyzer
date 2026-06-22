import { Module } from '@nestjs/common';
import { DeadlinesController } from './deadlines.controller';
import { DeadlinesService } from './deadlines.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [DeadlinesController],
  providers: [DeadlinesService],
  exports: [DeadlinesService],
})
export class DeadlinesModule {}