import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreatePhimDto } from './dto/create-phim.dto';
import { UpdatePhimDto } from './dto/update-phim.dto';

@Injectable()
export class PhimService {
  constructor(private prisma: PrismaClient) {}

  async getListBanner() {
    const banner = await this.prisma.banner.findMany()

    return {
      data: banner,
      message: 'Get Banner successfully',
      status: HttpStatus.OK,
      date: new Date()
    }
  }

  async getListPhim() {
    const phim = await this.prisma.phim.findMany()

    return {
      data: phim,
      message: 'Get Phim successfully',
      status: HttpStatus.OK,
      date: new Date()
    }
  }

  async getInfoPhim(maPhimNumber: number) {
    const phim = await this.prisma.phim.findMany({
      where: { ma_phim: maPhimNumber }
    })

    return {
      data: phim,
      message: 'Get Information Phim successfully',
      status: HttpStatus.OK,
      date: new Date()
    }
  }

  async deleteInfoPhim(maPhimNumber: number) {
    const phim = await this.prisma.phim.findMany({
      where: { ma_phim: maPhimNumber }
    })

    if (!phim) {
      throw new HttpException('Phim not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.phim.delete({
      where: { ma_phim: maPhimNumber }
    });

    return {
      message: 'Phim deleted successfully',
      status: HttpStatus.OK,
      date: new Date(),
    };
  }

  async addPhim(createPhimDto: CreatePhimDto, file: Express.Multer.File) {
    const {
      tenPhim,
      trailer,
      moTa,
      ngayKhoiChieu,
      danhGia,
      dangChieu,
      sapChieu,
      hot,
    } = createPhimDto;

    const dangChieuBoolean = String(dangChieu) === 'true';
    const sapChieuBoolean = String(sapChieu) === 'true';
    const hotBoolean = String(hot) === 'true';

    const newPhim = await this.prisma.phim.create({
      data: {
        ten_phim: tenPhim,
        trailer: trailer,
        mo_ta: moTa,
        ngay_khoi_chieu: new Date(ngayKhoiChieu),
        dang_chieu: dangChieuBoolean,
        sap_chieu: sapChieuBoolean,
        hot: hotBoolean,
        danh_gia: Number(danhGia), // Chuyển đổi danhGia thành số
        hinh_anh: file.filename,
      },
    });

    return {
      data: newPhim,
      message: 'Add Phim successfully',
      status: HttpStatus.OK,
      date: new Date(),
    };
  }

  async updatePhim(maPhim: string, updatePhimDto: UpdatePhimDto, file: Express.Multer.File) {
    const id = parseInt(maPhim, 10)

    const {
      tenPhim,
      trailer,
      moTa,
      ngayKhoiChieu,
      danhGia,
      dangChieu,
      sapChieu,
      hot,
    } = updatePhimDto;

    const dangChieuBoolean = String(dangChieu) === 'true';
    const sapChieuBoolean = String(sapChieu) === 'true';
    const hotBoolean = String(hot) === 'true';

    const updatedPhim = await this.prisma.phim.update({
      where: { ma_phim: id },
      data: {
        ten_phim: tenPhim,
        trailer: trailer,
        mo_ta: moTa,
        ngay_khoi_chieu: new Date(ngayKhoiChieu),
        dang_chieu: dangChieuBoolean,
        sap_chieu: sapChieuBoolean,
        hot: hotBoolean,
        danh_gia: Number(danhGia), // Chuyển đổi danhGia thành số
        hinh_anh: file ? file.filename : undefined, // Cập nhật file nếu có
      },
    });

    return {
      data: updatedPhim,
      message: 'Update Phim successfully',
      status: HttpStatus.OK,
      date: new Date(),
    };
  }
}
