import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import type { Request, Response } from 'express';
import { Public } from './utils/public.decorator';
import { RegisterRequestDto } from './dto/register-request.dto';
import { UserEntity } from 'src/user/entities/user.entity';
//import { UAParser } from 'ua-parser-js';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Req()
    req: Request,
    @Res()
    response: Response,
    @Body()
    userLoginDto: UserLoginDto,
  ) {
    //const ua = UAParser(req.headers['user-agent']);
    /* TODO
    const refreshTokenPayload: Partial<RefreshToken> = {
      ip: req.ip,
      userAgent: JSON.stringify(ua),
      browser: ua.browser.name,
      os: ua.os.name,
    };
    */
    //console.log(userLoginDto);
    let user: UserEntity | null = null;
    try {
      // Do the login here, no need to have an additional local (passport) strategy
      user = await this.authService.validateUser(
        userLoginDto.username,
        userLoginDto.password,
      );
    } catch (e) {
      // catch exceptions since in error case we just want to return 401 Unauthorized (see below)
      console.log('Exception in validateUser: ', e);
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    const accessToken = await this.authService.login(userLoginDto);
    response.cookie('jwt', accessToken, { httpOnly: true });

    return response.status(HttpStatus.NO_CONTENT).json({});
  }

  @Post('register')
  async register(
    @Req()
    req: Request,
    @Res()
    response: Response,
    @Body() registerBody: RegisterRequestDto,
  ) {
    const accessToken = await this.authService.register(registerBody);
    response.cookie('jwt', accessToken, { httpOnly: true });
    return response.status(HttpStatus.NO_CONTENT).json({});
  }
}
