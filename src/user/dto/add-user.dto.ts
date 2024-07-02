import { ApiProperty } from "@nestjs/swagger";

export class AddUserDto {
    @ApiProperty()
    tai_khoan: string; 

    @ApiProperty()
    ho_ten: string; 

    @ApiProperty()
    email: string; 

    @ApiProperty()
    so_dt: string; 

    @ApiProperty()
    mat_khau: string; 
    
    @ApiProperty()
    loai_nguoi_dung: string
}
