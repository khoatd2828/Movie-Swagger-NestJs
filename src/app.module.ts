import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TicketModule } from './ticket/ticket.module';
import { RapModule } from './rap/rap.module';
import { PhimModule } from './phim/phim.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'final',
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    TicketModule,
    RapModule,
    PhimModule,
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
