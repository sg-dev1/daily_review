import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class JwtPayloadDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  username: string;

  iat?: number;
  exp?: number;
}
