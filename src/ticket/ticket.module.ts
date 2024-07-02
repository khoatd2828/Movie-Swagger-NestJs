import { PrismaClient } from '@prisma/client';
import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';

@Module({
  controllers: [TicketController],
  providers: [TicketService, PrismaClient],
})
export class TicketModule {}
