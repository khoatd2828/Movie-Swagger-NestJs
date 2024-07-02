import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { NguoiDung, PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import {
  JWT_ACCESS_EXPIRES,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_EXPIRES,
  JWT_REFRESH_SECRET,
} from 'src/common/constant/auth.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaClient,
    private configService: ConfigService,
  ) {}

  generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  async register(registerAuthDto: RegisterAuthDto) {
    const { tai_khoan, ho_ten, email, so_dt, mat_khau, loai_nguoi_dung } =
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
        console.log(mat_khau);
        console.log(user.mat_khau);
        throw new HttpException(
          'Password is incorrect!',
          HttpStatus.BAD_REQUEST,
        );
      }

      // const key = this.generateRandomString(6);
      // const payload = { tai_khoan: user.tai_khoan, key };

      // const accessToken = this.jwtService.sign(payload, {
      //   expiresIn: '10m',
      //   algorithm: 'HS256',
      //   secret: process.env.JWT_SECRET,
      // });

      // const refreshToken = this.jwtService.sign(
      //   { tai_khoan: user.tai_khoan, key },
      //   {
      //     expiresIn: '7d',
      //     algorithm: 'HS256',
      //     secret: process.env.JWT_SECRET_REFRESH,
      //   },
      // );

      // user.refresh_token = refreshToken;

      // await this.prisma.nguoiDung.update({
      //   data: user,
      //   where: { tai_khoan: user.tai_khoan },
      // });

      const tokens = await this.createTokens(user);

      return {
        data: tokens,
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

  async createTokens(user: NguoiDung) {
    const { id } = user;
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
        },
        {
          secret: this.configService.get<string>(JWT_ACCESS_SECRET),
          expiresIn: this.configService.get<string>(JWT_ACCESS_EXPIRES),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
        },
        {
          secret: this.configService.get<string>(JWT_REFRESH_SECRET),
          expiresIn: this.configService.get<string>(JWT_REFRESH_EXPIRES),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(user: any) {
    const tokens = await this.createTokens(user);
    // await this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      data: tokens,
      message: 'Login successfully!',
      status: HttpStatus.OK,
      date: new Date(),
    };
  }
}
