import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { BetterAuthMiddleware } from './better-auth.middleware';

@Module({})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BetterAuthMiddleware).forRoutes('auth');
  }
}