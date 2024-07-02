import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

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
}
