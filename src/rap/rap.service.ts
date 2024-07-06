import { Phim, LichChieu } from './../ticket/entities/ticket.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RapService {
  constructor(private prisma: PrismaClient) {}

  async getInfoRap(tenHeThongRap: string) {
    let raps;

    if (!tenHeThongRap) {
      raps = await this.prisma.heThongRap.findMany();
    } else {
      raps = await this.prisma.heThongRap.findMany({
        where: {
          ten_he_thong_rap: tenHeThongRap,
        },
      });
    }

    if (raps.length === 0) {
      throw new HttpException('No raps found', HttpStatus.NOT_FOUND);
    }

    return {
      data: raps,
      message: 'Get raps successfully',
      status: HttpStatus.OK,
      date: new Date(),
    };
  }

  async getInfoLichChieuPhim(MaPhim: number) {
    const lichChieuPhim = await this.prisma.lichChieu.findMany({
      where: {
        ma_phim: MaPhim,
      },
      include: {
        RapPhim: {
          include: {
            CumRap: {
              include: {
                HeThongRap: true,
              },
            },
            LichChieu: true,
          },
        },
        Phim: true,
      },
    });

    const heThongRapChieu = lichChieuPhim.map((lichChieu) => ({
      maHeThongRap: lichChieu.RapPhim.CumRap.HeThongRap.ma_he_thong_rap,
      tenHeThongRap: lichChieu.RapPhim.CumRap.HeThongRap.ten_he_thong_rap,
      logo: lichChieu.RapPhim.CumRap.HeThongRap.logo,
      cumRapChieu: [
        {
          maCumRap: lichChieu.RapPhim.CumRap.ma_cum_rap.toString(),
          tenCumRap: lichChieu.RapPhim.CumRap.ten_cum_rap,
          diaChi: lichChieu.RapPhim.CumRap.dia_chi,
          lichChieuPhim: [
            {
              maLichChieu: lichChieu.ma_lich_chieu.toString(),
              maRap: lichChieu.RapPhim.ma_rap.toString(),
              tenRap: lichChieu.RapPhim.ten_rap,
              ngayChieuGioChieu: lichChieu.ngay_gio_chieu.toISOString(), // Định dạng ngày giờ UTC
              giaVe: lichChieu.gia_ve,
              thoiLuong: 120, // Thời lượng phim, thay đổi tùy theo dữ liệu thực tế
            },
          ],
        },
      ],
    }));

    return { content: { heThongRapChieu } };
  }

  async getInfoCumRapHeThong(maHeThongRap: string) {
    const heThongRapPhim = await this.prisma.heThongRap.findMany({
      where: {
        ten_he_thong_rap: maHeThongRap,
      },
      include: {
        CumRap: {
          include: {
            RapPhim: true,
          },
        },
      },
    });

    const heThongRapChieu = heThongRapPhim.flatMap((heThong) =>
      heThong.CumRap.map((cumRap) => ({
        maCumRap: cumRap.ma_cum_rap,
        tenCumRap: cumRap.ten_cum_rap,
        diaChi: cumRap.dia_chi,
        danhSachRap: cumRap.RapPhim.map((rapPhim) => ({
          maRap: rapPhim.ma_rap,
          tenRap: rapPhim.ten_rap,
        })),
      })),
    );

    return { content: { heThongRapChieu } };
  }

  async getInfoLichChieuHeThong(maHeThongRap: string) {
    const heThongRapPhim = await this.prisma.heThongRap.findMany({
      where: {
        ten_he_thong_rap: maHeThongRap,
      },
      include: {
        CumRap: {
          include: {
            RapPhim: {
              include: {
                LichChieu: {
                  include: {
                    Phim: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const heThongRapChieu = heThongRapPhim.map((heThong) => ({
      maHeThongRap: heThong.ma_he_thong_rap,
      tenHeThongRap: heThong.ten_he_thong_rap,
      logo: heThong.logo,
      lstCumRap: heThong.CumRap.map((cumRap) => ({
        maCumRap: cumRap.ma_cum_rap,
        tenCumRap: cumRap.ten_cum_rap,
        diaChi: cumRap.dia_chi,
        danhSachRap: cumRap.RapPhim.map((rapPhim) => ({
          maRap: rapPhim.ma_rap,
          tenRap: rapPhim.ten_rap,
          danhSachPhim: rapPhim.LichChieu.map((lichchieu) => ({
            maPhim: lichchieu.Phim.ma_phim,
            tenPhim: lichchieu.Phim.ten_phim,
            hot: lichchieu.Phim.hot,
            dangChieu: lichchieu.Phim.dang_chieu,
            sapChieu: lichchieu.Phim.sap_chieu,
            lstLichChieuTheoPhim: rapPhim.LichChieu.map((lichChieu) => ({
              maLichChieu: lichChieu.ma_lich_chieu,
              maRap: lichChieu.ma_rap,
              tenRap: rapPhim.ten_rap,
              ngayChieuGioChieu: lichChieu.ngay_gio_chieu,
              giaVe: lichChieu.gia_ve,
            })),
          })),
        })),
      })),
    }));
    return { content: { heThongRapChieu } };
  }
}
