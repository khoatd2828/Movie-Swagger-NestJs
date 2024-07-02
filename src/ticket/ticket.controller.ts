import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { LichChieuDto } from './dto/tao-lich-chieu.dto';
import { BookTicketDto } from './dto/book-ticket.dto';
import { ListPhongVeDto } from './dto/list-phong-ve.dto';

@ApiTags('QuanLyDatVe')
@Controller('QuanLyDatVe')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post("TaoLichChieu")
  taoLichChieu(@Body() lichChieu: LichChieuDto) {
    return this.ticketService.taoLichChieu(lichChieu)
  }

  @Post("DatVe")
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  datVe(@Req() req: Request & {user:any}, @Body() datVeDto: BookTicketDto) {
    return this.ticketService.datVe(datVeDto, req.user)
  }

  @Get('LayDanhSachPhongVe')
  getListPhongVe(@Query('MaLichChieu') MaLichChieu: string){
    const listPhongVeNumber = parseInt(MaLichChieu, 10)
    return this.ticketService.getListPhongVe(listPhongVeNumber)
  }
}
