import { Controller, Delete, Body, Headers, HttpException, HttpStatus, Get, Query, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('QuanLyNguoiDung')
@Controller('api/QuanLyNguoiDung')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete('XoaNguoiDung')
  delete(@Headers('TaiKhoan') TaiKhoan: string) {
    if (!TaiKhoan) {
      throw new HttpException('TaiKhoan là bắt buộc', HttpStatus.BAD_REQUEST);
    }

    return this.userService.delete(TaiKhoan);
  }

  @Get('LayDanhSachLoaiNguoiDung')
  getRoleUser() {
    return this.userService.getRoleUser()
  }

  @Get('LayDanhSachNguoiDung')
  @ApiQuery({ name: 'tuKhoa', required: false })
  getUser(@Query('tuKhoa') tuKhoa: string) {
    return this.userService.getUser(tuKhoa)
  }

  @Get('TimKiemNguoiDung')
  @ApiQuery({ name: 'tuKhoa', required: false })
  searchUser(@Query('tuKhoa') tuKhoa: string) {
    return this.userService.searchUser(tuKhoa)
  }

  @Get('ThongTinTaiKhoan')
  inforUser(@Headers('Authorization') Authorization: string) {
    return this.userService.inforUser(Authorization);
  }
}
