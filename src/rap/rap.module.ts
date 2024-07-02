import { Module } from '@nestjs/common';
import { RapService } from './rap.service';
import { RapController } from './rap.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [RapController],
  providers: [RapService, PrismaClient],
})
export class RapModule {}
