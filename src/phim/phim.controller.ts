import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common';
import { PhimService } from './phim.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { CreatePhimDto } from './dto/create-phim.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { upload } from 'src/common/upload';
import { UpdatePhimDto } from './dto/update-phim.dto';

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

  @Post('ThemPhimUploadHinh')
  @UseInterceptors(FileInterceptor('hinhAnh'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Add Phim mới',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        tenPhim: { type: 'string' },
        trailer: { type: 'string' },
        moTa: { type: 'string' },
        ngayKhoiChieu: { type: 'string', format: 'date' },
        danhGia: { type: 'number' },
        dangChieu: { type: 'boolean' },
        sapChieu: { type: 'boolean' },
        hot: { type: 'boolean' },
        hinhAnh: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async addPhim(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPhimDto: CreatePhimDto
  ) {
    return this.phimService.addPhim(createPhimDto, file);
  }

  @Post('CapNhatPhimUpload')
  @UseInterceptors(FileInterceptor('hinhAnh'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update Phim',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        tenPhim: { type: 'string' },
        trailer: { type: 'string' },
        moTa: { type: 'string' },
        ngayKhoiChieu: { type: 'string', format: 'date' },
        danhGia: { type: 'number' },
        dangChieu: { type: 'boolean' },
        sapChieu: { type: 'boolean' },
        hot: { type: 'boolean' },
        hinhAnh: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async updatePhim(
    @UploadedFile() file: Express.Multer.File,
    @Query('MaPhim') maPhim: string,
    @Body() updatePhimDto: UpdatePhimDto
  ) {
    return this.phimService.updatePhim(maPhim, updatePhimDto, file);
  }
}
