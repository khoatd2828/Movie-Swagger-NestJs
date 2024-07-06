import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RapService } from './rap.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('QuanLyRap')
@Controller('QuanLyRap')
export class RapController {
  constructor(private readonly rapService: RapService) {}

  @Get('LayThongTinHeThongRap')
  @ApiQuery({ name: 'tenHeThongRap', required: false })
  getInfoRap(@Query('tenHeThongRap') tenHeThongRap: string) {
    return this.rapService.getInfoRap(tenHeThongRap);
  }

  @Get('LayThongTinLichChieuPhim')
  getInfoLichChieuPhim(@Query('MaPhim') MaPhim: string) {
    const MaPhimNumber = parseInt(MaPhim, 10)
    return this.rapService.getInfoLichChieuPhim(MaPhimNumber);
  }

  @Get('LayThongTinCumRapTheoHeThong')
  getInfoCumRapHeThong(@Query('maHeThongRap') maHeThongRap: string) {
    return this.rapService.getInfoCumRapHeThong(maHeThongRap);
  }

  @Get('LayThongTinLichChieuHeThongRap')
  getInfoLichChieuHeThong(@Query('maHeThongRap') maHeThongRap: string) {
    return this.rapService.getInfoLichChieuHeThong(maHeThongRap);
  }
}
