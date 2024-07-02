import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard copy';

@ApiTags('Auth')
@Controller('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('DangNhap')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('DangKy')
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }


  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  refreshTokens(@Req() req: Request & {user: any}) {
    return this.authService.refreshTokens(req.user);
  }
}
