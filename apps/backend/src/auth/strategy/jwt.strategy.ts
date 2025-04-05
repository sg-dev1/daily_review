import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import type { Request } from 'express';
import { UserService } from '../../user/user.service';
import { User } from '../../user/entities/user.entity';

const cookieExtractor = (req?: Request): string | null => {
  //console.log('cookieExtractor - req?.cookies', req);
  // If put into Authentication cookie (like in MAD) it needs to be extracted like so:
  // return req?.cookies?.Authentication;
  if (req?.cookies) {
    return req?.cookies['jwt'];
  } else {
    return null;
  }
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayloadDto): Promise<User> {
    // console.log('[JwtStrategy.validate] payload', payload);
    // example output payload { username: 'user2xxxxxxx', iat: 1732527504, exp: 1732613904 }

    // check if user exists
    const user = await this.userService.findOneByUsername(payload.username);
    if (user === null) {
      throw new UnauthorizedException('User not found');
    }
    // Further checks would be: is user not disabled, etc.
    if (user.isDisabled) {
      throw new UnauthorizedException('Disabled user');
    }

    // Note: Important to return the User object s.t. it can be retrieved with @GetUser() decorator
    return user;
  }
}
