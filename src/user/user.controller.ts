import { JwtService } from '@nestjs/jwt';
import {
  Controller,
  Delete,
  Body,
  Headers,
  HttpException,
  HttpStatus,
  Get,
  Query,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AddUserDto } from './dto/add-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';

@ApiTags('QuanLyNguoiDung')
@Controller('QuanLyNguoiDung')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete('XoaNguoiDung')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  delete(@Headers('TaiKhoan') TaiKhoan: string) {
    if (!TaiKhoan) {
      throw new HttpException('TaiKhoan là bắt buộc', HttpStatus.BAD_REQUEST);
    }

    return this.userService.delete(TaiKhoan);
  }

  @Get('LayDanhSachLoaiNguoiDung')
  getRoleUser() {
    return this.userService.getRoleUser();
  }

  @Get('LayDanhSachNguoiDung')
  @ApiQuery({ name: 'tuKhoa', required: false })
  getUser(@Query('tuKhoa') tuKhoa: string) {
    return this.userService.getUser(tuKhoa);
  }

  @Get('TimKiemNguoiDung')
  @ApiQuery({ name: 'tuKhoa', required: false })
  searchUser(@Query('tuKhoa') tuKhoa: string) {
    return this.userService.searchUser(tuKhoa);
  }

  // @Post('ThongTinTaiKhoan')
  // inforUser(@Headers('Authorizations') Authorization: string) {
  //   console.log(Authorization)
  //   return this.userService.inforUser(Authorization);
  // }
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post('ThongTinTaiKhoan')
  inforUser(@Req() req: Request) {
    const [token] = req.get(`authorization`)?.split(' ') ?? [];

    return this.userService.inforUser(token);
  }

  @ApiBearerAuth()
  @Post('ThemNguoiDung')
  addUser(@Body() addUserDto: AddUserDto) {

    return this.userService.addUser(addUserDto);
  }

  @ApiBearerAuth()
  @Post('CapNhatThongTinNguoiDung')
  @UseGuards(AccessTokenGuard)
  updateUser(@Req() req: Request & {user:any}, @Body() updateUserDto: UpdateUserDto) {

    return this.userService.updateUser(updateUserDto, req.user);
  }



}
