import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaClient,
  ) {}

  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  async register(registerAuthDto: RegisterAuthDto) {
    const {tai_khoan, ho_ten, email, so_dt, mat_khau, loai_nguoi_dung } =
      registerAuthDto;
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
      message: 'Sign up successfully!',
      status: HttpStatus.CREATED,
      date: new Date(),
    };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { tai_khoan, mat_khau } = loginAuthDto;

    try {
      const user = await this.prisma.nguoiDung.findFirst({
        where: { tai_khoan: tai_khoan },
      });

      if (!user) {
        throw new HttpException('User is not found!', HttpStatus.NOT_FOUND);
      }

      if (!bcrypt.compareSync(mat_khau, user.mat_khau)) {
        console.log(mat_khau)
        console.log(user.mat_khau)
        throw new HttpException(
          'Password is incorrect!',
          HttpStatus.BAD_REQUEST,
        );
      }

      const key = this.generateRandomString(6);
      const payload = { tai_khoan: user.tai_khoan, key };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '10m',
        algorithm: 'HS256',
        secret: process.env.JWT_SECRET,
      });

      const refreshToken = this.jwtService.sign(
        { tai_khoan: user.tai_khoan, key },
        {
          expiresIn: '7d',
          algorithm: 'HS256',
          secret: process.env.JWT_SECRET_REFRESH,
        },
      );

      // user.refresh_token = refreshToken;

      await this.prisma.nguoiDung.update({
        data: user,
        where: { tai_khoan: user.tai_khoan },
      });

      return {
        data: accessToken,
        message: 'Login successfully!',
        status: HttpStatus.OK,
        date: new Date(),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An error occurred during the login process',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
