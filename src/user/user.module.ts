import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Thay bằng khóa bí mật thực tế
      signOptions: { expiresIn: '10m' }, // Tuổi thọ của token
    }),
    // Import các module khác nếu cần thiết
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [JwtModule],
})
export class UserModule {}
