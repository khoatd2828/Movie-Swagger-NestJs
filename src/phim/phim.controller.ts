import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PhimService } from './phim.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';

@ApiTags('QuanLyPhim')
@Controller('QuanLyPhim')
export class PhimController {
  constructor(private readonly phimService: PhimService) {}

  @Get('LayDanhSachBanner')
  getListBanner() {
    return this.phimService.getListBanner()
  }

  @Get('LayDanhSachPhim')
  getListPhim() {
    return this.phimService.getListPhim()
  }

  @Get('LayThongTinPhim')
  getInfoPhim(@Query('MaPhim') MaPhim: string) {
    const maPhimNumber = parseInt(MaPhim, 10)
    return this.phimService.getInfoPhim(maPhimNumber)
  }

  @Delete('XoaPhim')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  deleteInfoPhim(@Query('MaPhim') MaPhim: string) {
    const maPhimNumber = parseInt(MaPhim, 10)
    return this.phimService.deleteInfoPhim(maPhimNumber)
  }
}
