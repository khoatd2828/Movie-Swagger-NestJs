import { ApiProperty } from "@nestjs/swagger";

export class LichChieuDto  {
    @ApiProperty()
    ma_phim: number; 

    @ApiProperty()
    ngay_gio_chieu: Date; 

    @ApiProperty()
    ma_rap: number; 

    @ApiProperty()
    gia_ve: number; 
}
