import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// create-user-dto
export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
