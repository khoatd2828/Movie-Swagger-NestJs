import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AddUserDto } from './dto/add-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaClient) {}

  async delete(TaiKhoan: string) {
    const user = await this.prisma.nguoiDung.findFirst({
      where: { tai_khoan: TaiKhoan },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.nguoiDung.delete({
      where: { id: user.id },
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

  async inforUser(userToken: any) {
    try {
      // const decoded = this.jwtService.verify(token, {
      //   secret: process.env.JWT_SECRET,
      // });
      // const tai_khoan = decoded.tai_khoan;

      const user = await this.prisma.nguoiDung.findFirst({
        where: { id: userToken.id },
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
      console.log(`error`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  async addUser(addUserDto: AddUserDto) {
    const { tai_khoan, ho_ten, email, so_dt, mat_khau, loai_nguoi_dung } =
      addUserDto;
    const user = await this.prisma.nguoiDung.findFirst({
      where: { email: email },
    });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = bcrypt.hashSync(mat_khau, 10);

    await this.prisma.nguoiDung.create({
      data: {
        tai_khoan,
        ho_ten,
        email,
        so_dt,
        mat_khau: hashedPassword,
        loai_nguoi_dung,
      },
    });
    return {
      message: 'Add user successfully!',
      status: HttpStatus.CREATED,
      date: new Date(),
    };
  }

  async updateUser(updateUserDto: UpdateUserDto, user: any) {
    try {
      const updatedUser = await this.prisma.nguoiDung.update({
        where: { id: user.id },
        data: updateUserDto,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid token',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async findById(id: number) {
    return await this.prisma.nguoiDung.findFirst({ where: { id: id } });
  }
}
