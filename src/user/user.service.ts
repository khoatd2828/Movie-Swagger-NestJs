import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserService {
  private prisma: PrismaClient;
  private jwtService: JwtService;

  async delete(TaiKhoan: string) {
    const user = await this.prisma.nguoiDung.findFirst({
      where: { tai_khoan: TaiKhoan },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.nguoiDung.delete({
      where: { tai_khoan: TaiKhoan },
    });

    return {
      message: 'User deleted successfully',
      status: HttpStatus.OK,
      date: new Date(),
    };
  }

  async getRoleUser() {
    const roleUser = await this.prisma.nguoiDung.findMany({
      distinct: ['loai_nguoi_dung'],
      select: {
        loai_nguoi_dung: true,
      },
    });

    return {
      data: roleUser,
      message: 'Get role successfully',
      status: HttpStatus.OK,
      date: new Date(),
    };
  }

  async getUser(tuKhoa: string) {
    let users;

    if (!tuKhoa) {
      users = await this.prisma.nguoiDung.findMany();
    } else {
      users = await this.prisma.nguoiDung.findMany({
        where: {
          OR: [
            { ho_ten: { contains: tuKhoa } },
            { tai_khoan: { contains: tuKhoa } },
            { so_dt: { contains: tuKhoa } },
          ],
        },
      });
    }

    if (users.length === 0) {
      throw new HttpException('No users found', HttpStatus.NOT_FOUND);
    }

    return {
      data: users,
      message: 'Get users successfully',
      status: HttpStatus.OK,
      date: new Date(),
    };
  }

  async searchUser(tuKhoa: string) {
    let users;

    if (!tuKhoa) {
      users = await this.prisma.nguoiDung.findMany();
    } else {
      users = await this.prisma.nguoiDung.findMany({
        where: {
          OR: [
            { ho_ten: { contains: tuKhoa } },
            { tai_khoan: { contains: tuKhoa } },
            { so_dt: { contains: tuKhoa } },
          ],
        },
      });
    }

    if (users.length === 0) {
      throw new HttpException('No users found', HttpStatus.NOT_FOUND);
    }

    return {
      data: users,
      message: 'Search users successfully',
      status: HttpStatus.OK,
      date: new Date(),
    };
  }

  async inforUser(accessToken: string) {
    try {
      const decoded = this.jwtService.verify(accessToken); // Giải mã accessToken
      const tai_khoan = decoded.tai_khoan; // Lấy tài khoản từ payload

      console.log(tai_khoan);

      const user = await this.prisma.nguoiDung.findUnique({
        where: { tai_khoan },
        select: {
          tai_khoan: true,
          ho_ten: true,
          email: true,
          so_dt: true,
          loai_nguoi_dung: true,
        },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return {
        data: user,
        message: 'Get user information successfully!',
        status: HttpStatus.OK,
        date: new Date(),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
