import { Module } from '@nestjs/common';
import { PhimService } from './phim.service';
import { PhimController } from './phim.controller';
import { PrismaClient } from '@prisma/client';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './public/img',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          callback(null, `${uniqueSuffix}_${file.originalname}`);
        },
      }),
    }),
  ],
  controllers: [PhimController],
  providers: [PhimService, PrismaClient],
})
export class PhimModule {}
