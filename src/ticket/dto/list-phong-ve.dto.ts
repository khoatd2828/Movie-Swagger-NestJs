import { ApiProperty } from "@nestjs/swagger";

export class ListPhongVeDto {
    @ApiProperty()
    maLichChieu: number;
}
