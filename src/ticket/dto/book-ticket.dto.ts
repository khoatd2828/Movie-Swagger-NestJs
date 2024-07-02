import { ApiProperty } from "@nestjs/swagger";

export class BookTicketDto {
    @ApiProperty()
    ma_lich_chieu: number;
  
    @ApiProperty()
    ma_ghe: number;
}
