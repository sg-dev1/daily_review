import { ApiProperty } from '@nestjs/swagger';
import { RegisterRequestDtoType } from '@repo/shared';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterRequestDto implements RegisterRequestDtoType {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
