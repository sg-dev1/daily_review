import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
  UserControllerResult,
  UserControllerResultWithData,
  UserControllerResultWithSingleData,
  UserDto,
} from '@repo/shared';
import { checkedHttpException } from '../utils/checkedHttpException';
import { Roles } from '../auth/utils/roles.decorator';
import { Role } from '../auth/utils/role.enum';
import { GetUser } from '../auth/utils/get-user.decorator';
import { checkedModifyOperation } from '../utils/modify.check';

@Controller('users') //route group
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.Admin)
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
  @Roles(Role.Admin)
  async findAll(): Promise<UserControllerResultWithData> {
    try {
      const data: User[] = await this.userService.findAll();
      //console.log('Found users: ', data);
      const dataAsDto: UserDto[] = data.map((entity: User) =>
        entity.toSanitizedDto(),
      );
      return {
        success: true,
        data: dataAsDto,
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
    @GetUser() executingUser: User,
    @Param('id') id: string,
  ): Promise<UserControllerResultWithSingleData> {
    checkedModifyOperation(executingUser, +id);
    try {
      const data = (await this.userService.findOne(+id)).toSanitizedDto();
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
    @GetUser() executingUser: User,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserControllerResult> {
    checkedModifyOperation(executingUser, +id);

    if (!executingUser.isAdmin && updateUserDto.isAdmin) {
      // not allowed to elevate a normal user to an admin user
      throw new ForbiddenException('Operation forbidden');
    }
    if (
      executingUser.isAdmin &&
      executingUser.id === +id &&
      (updateUserDto.isAdmin === false || updateUserDto.isDisabled === true)
    ) {
      const admins = await this.userService.findAllAdmins();
      if (admins.length === 1) {
        throw new ForbiddenException(
          'Not allowed to remove/disable the last admin',
        );
      }
    }

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
  async remove(
    @GetUser() executingUser: User,
    @Param('id') id: string,
  ): Promise<UserControllerResult> {
    checkedModifyOperation(executingUser, +id);

    if (executingUser.isAdmin && executingUser.id === +id) {
      const admins = await this.userService.findAllAdmins();
      if (admins.length === 1) {
        throw new ForbiddenException('Not allowed to delete the last admin');
      }
    }

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
