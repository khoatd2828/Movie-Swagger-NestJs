import { Module } from '@nestjs/common';
import { PhimService } from './phim.service';
import { PhimController } from './phim.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [PhimController],
  providers: [PhimService, PrismaClient],
})
export class PhimModule {}
