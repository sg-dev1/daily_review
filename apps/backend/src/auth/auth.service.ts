import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from './dto/user-login.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterRequestDto } from './dto/register-request.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { MailService } from '../mail/mail.service';

/*
const BASE_OPTIONS: SignOptions = {
  issuer: 'https://localhost:7777',
  audience: 'https://localhost:7777',
};
*/

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user: User =
      await this.userService.findOneByUsernameChecked(username);
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  /**
   * Login user by username and password
   * @param userLoginDto
   */
  async login(userLoginDto: UserLoginDto): Promise<string> {
    const payload: JwtPayloadDto = { username: userLoginDto.username };
    return this.jwtService.sign(payload);
  }

  async register(user: RegisterRequestDto): Promise<string> {
    const existingUser = await this.userService.findOneByUsername(
      user.username,
    );
    if (existingUser) {
      throw new BadRequestException('username already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUserDto: CreateUserDto = { ...user, password: hashedPassword };
    const newUser = await this.userService.create(newUserDto);

    await this.mailService.sendUserConfirmation(
      newUser,
      'this-should-be-random',
    );

    return this.login(newUser);
  }
}
