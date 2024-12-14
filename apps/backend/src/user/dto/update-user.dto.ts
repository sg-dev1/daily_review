import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// https://github.com/nestjs/swagger/issues/1074#issuecomment-739850091
export class UpdateUserDto extends PartialType(CreateUserDto) {}
