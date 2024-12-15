import { ApiProperty } from '@nestjs/swagger';
import { UserLoginDtoType } from '@repo/shared';
import { IsNotEmpty } from 'class-validator';

/**
 * user login data transfer object
 */
export class UserLoginDto implements UserLoginDtoType {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  password!: string;
}
