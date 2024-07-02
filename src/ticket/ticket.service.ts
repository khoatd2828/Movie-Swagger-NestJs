import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LichChieuDto } from './dto/tao-lich-chieu.dto';
import { BookTicketDto } from './dto/book-ticket.dto';
import { ListPhongVeDto } from './dto/list-phong-ve.dto';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaClient) {}

  async taoLichChieu(lichChieu: LichChieuDto) {
    const { ma_phim, ngay_gio_chieu, ma_rap, gia_ve } = lichChieu;

    await this.prisma.lichChieu.create({
      data: {
        ma_phim,
        ngay_gio_chieu,
        ma_rap,
        gia_ve,
      },
    });

    return {
      message: 'Add lich chieu successfully!',
      status: HttpStatus.CREATED,
      date: new Date(),
    };
  }

  async datVe(datVeDto: BookTicketDto, user: any) {
    const { ma_lich_chieu, ma_ghe } = datVeDto;

    try {
      // Tạo đặt vé trong CSDL sử dụng Prisma
      await this.prisma.datVe.create({
        data: {
          nguoidung_id: user.id,
          ma_lich_chieu,
          ma_ghe,
        },
      });

      return {
        message: 'Đặt vé thành công!',
        status: HttpStatus.CREATED,
        date: new Date(),
      };
    } catch (error) {
      console.error('Đặt vé thất bại:', error);
      return {
        message: 'Đặt vé thất bại!',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        date: new Date(),
      };
    }
  }

  async getListPhongVe(listPhongVeNumber: number) {
    const lichChieu = await this.prisma.lichChieu.findFirst({
      where: { ma_lich_chieu: listPhongVeNumber },
      include: {
        RapPhim: {
          include: {
            CumRap: {
              include: {
                HeThongRap: true,
              },
            },
          },
        },
        Phim: true,
      },
    });

    if (!lichChieu) {
      throw new Error('Lịch chiếu không tồn tại');
    }

    const danhSachGhe = await this.prisma.ghe.findMany({
      where: { ma_rap: lichChieu.ma_rap },
      include: {
        DatVe: {
          where: { ma_lich_chieu: listPhongVeNumber },
          include: {
            NguoiDung: true,
          },
        },
      },
    });

    const response = {
      thongTinPhim: {
        maLichChieu: lichChieu.ma_lich_chieu,
        tenCumRap: lichChieu.RapPhim.CumRap.ten_cum_rap,
        tenRap: lichChieu.RapPhim.ten_rap,
        diaChi: lichChieu.RapPhim.CumRap.dia_chi,
        tenPhim: lichChieu.Phim.ten_phim,
        hinhAnh: lichChieu.Phim.hinh_anh,
        ngayGioChieu: lichChieu.ngay_gio_chieu.toISOString().replace('T', ' ').substr(0, 16),
      },
      danhSachGhe: danhSachGhe.map(ghe => {
        const ve = ghe.DatVe[0]; // Chỉ lấy một vé vì mỗi ghế có thể chỉ được đặt một lần cho một lịch chiếu
        return {
          maGhe: ghe.ma_ghe,
          tenGhe: ghe.ten_ghe,
          maRap: ghe.ma_rap,
          loaiGhe: ghe.loai_ghe,
          giaVe: lichChieu.gia_ve,
          daDat: !!ve,
          tai_khoan: ve ? ve.NguoiDung.tai_khoan : null,
        };
      }),
    };

    return response;
  }
}
