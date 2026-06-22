import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ExtensionController } from './extension.controller';
import { ExtensionService } from './extension.service';

@Module({
  imports: [PrismaModule],
  controllers: [ExtensionController],
  providers: [ExtensionService],
  exports: [ExtensionService],
})
export class ExtensionModule {}
