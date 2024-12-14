import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  email!: string;
}
