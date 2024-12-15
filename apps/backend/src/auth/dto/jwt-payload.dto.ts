import { ApiProperty } from '@nestjs/swagger';
import { JwtPayloadDtoType } from '@repo/shared';
import { IsNotEmpty } from 'class-validator';

export class JwtPayloadDto implements JwtPayloadDtoType {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  username!: string;

  iat?: number;
  exp?: number;
}
