import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDtoType } from '@repo/shared';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

// create-user-dto
export class CreateUserDto implements CreateUserDtoType {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  username!: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  password!: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ required: true })
  @IsBoolean()
  isAdmin!: boolean;
}
