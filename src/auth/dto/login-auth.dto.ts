import { ApiProperty } from "@nestjs/swagger";

export class LoginAuthDto {
    @ApiProperty()
    tai_khoan: string; 

    @ApiProperty()
    mat_khau: string; 
}
