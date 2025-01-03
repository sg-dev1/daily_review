import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import ormConfig from './config/ormconfig';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { JwtGuard } from './auth/utils/jwt.guard';
import { APP_GUARD } from '@nestjs/core';
import { TextSnippetModule } from './text-snippet/text-snippet.module';
import { MailModule } from './mail/mail.module';
import { ReviewScheduleModule } from './review-schedule/review-schedule.module';
import { RolesGuard } from './auth/utils/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    UserModule,
    AuthModule,
    TextSnippetModule,
    MailModule,
    ReviewScheduleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Use whitelisting approach,
    // per default all endpoints need to be authenticated unless they have a @Public() decorator (see auth.controller.ts)
    // see https://medium.com/@camillefauchier/implementing-authentication-in-nestjs-using-passport-and-jwt-5a565aa521de
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
