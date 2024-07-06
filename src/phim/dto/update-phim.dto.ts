import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePhimDto {
  @ApiProperty({ type: String })
  @IsString()
  tenPhim: string;

  @ApiProperty({ type: String })
  @IsString()
  trailer: string;

  @ApiProperty({ type: String })
  @IsString()
  moTa: string;

  @ApiProperty({ type: String })
  @IsDateString()
  ngayKhoiChieu: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  danhGia: number;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  dangChieu: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  sapChieu: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  hot: boolean;
}
