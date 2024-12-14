import { Controller, ForbiddenException, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/utils/public.decorator';
import type { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  async getRootPage(
    @Res()
    response: Response,
  ) {
    //console.log('process.env.NODE_ENV', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
      response.redirect('/api-docs');
    } else {
      throw new ForbiddenException('forbidden');
    }
  }
}
