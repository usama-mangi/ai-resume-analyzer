import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { OfferNegotiationController } from './offer-negotiation.controller';
import { OfferNegotiationService } from './offer-negotiation.service';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [OfferNegotiationController],
  providers: [OfferNegotiationService],
  exports: [OfferNegotiationService],
})
export class OfferNegotiationModule {}
