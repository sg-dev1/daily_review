import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserControllerResult } from '@repo/shared';

interface UserControllerResultWithData extends UserControllerResult {
  data: UserEntity[];
}

interface UserControllerResultWithSingleData extends UserControllerResult {
  data: UserEntity | null;
}

const checkedHttpException = (error: unknown): string => {
  let result = '';
  if (error instanceof HttpException) {
    result = error.message;
  } else {
    result = 'Unknown error: ' + String(error);
  }
  return result;
};

@Controller('users') //route group
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserControllerResult> {
    try {
      await this.userService.create(createUserDto);

      return {
        success: true,
        message: 'User Created Successfully',
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: checkedHttpException(error),
      };
    }
  }

  @Get()
  async findAll(): Promise<UserControllerResultWithData> {
    try {
      const data = (await this.userService.findAll()).map((entity) =>
        entity.toSanitized(),
      );
      return {
        success: true,
        data,
        message: 'User Fetched Successfully',
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: checkedHttpException(error),
        data: [],
      };
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<UserControllerResultWithSingleData> {
    try {
      const data = (await this.userService.findOne(+id)).toSanitized();
      return {
        success: true,
        data,
        message: 'User Fetched Successfully',
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: checkedHttpException(error),
        data: null,
      };
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserControllerResult> {
    try {
      await this.userService.update(+id, updateUserDto);
      return {
        success: true,
        message: 'User Updated Successfully',
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: checkedHttpException(error),
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<UserControllerResult> {
    try {
      await this.userService.remove(+id);
      return {
        success: true,
        message: 'User Deleted Successfully',
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: checkedHttpException(error),
      };
    }
  }
}
