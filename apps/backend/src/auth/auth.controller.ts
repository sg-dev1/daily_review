import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { response, type Request, type Response } from 'express';
import { Public } from './utils/public.decorator';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from './utils/get-user.decorator';
import { UserDto } from '@repo/shared';
//import { UAParser } from 'ua-parser-js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Req()
    req: Request,
    @Res()
    response: Response,
    @Body()
    userLoginDto: UserLoginDto,
  ): Promise<Response> {
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
    let user: User | null = null;
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

  /*
  @Post('register')
  async register(
    @Req()
    req: Request,
    @Res()
    response: Response,
    @Body() registerBody: RegisterRequestDto,
  ): Promise<Response> {
    const accessToken = await this.authService.register(registerBody);
    response.cookie('jwt', accessToken, { httpOnly: true });
    return response.status(HttpStatus.NO_CONTENT).json({});
  }
  */

  @Get('profile')
  profile(
    // @Req()
    // req: Request,
    // @Res()
    // response: Response,
    @GetUser() executingUser: User,
  ): UserDto {
    if (executingUser) {
      //console.log('executingUser', executingUser);
      return executingUser.toSanitizedDto();
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  @Post('logout')
  logout(
    @Req()
    req: Request,
    @Res()
    response: Response,
    @GetUser() executingUser: User,
  ): Response {
    response.cookie('jwt', '', { httpOnly: true });
    return response.sendStatus(HttpStatus.NO_CONTENT);
  }
}
