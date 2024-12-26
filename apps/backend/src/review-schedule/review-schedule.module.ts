import { Module } from '@nestjs/common';
import { ReviewScheduleService } from './review-schedule.service';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { TextSnippetModule } from '../text-snippet/text-snippet.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    UserModule,
    MailModule,
    TextSnippetModule,
    ScheduleModule.forRoot(),
  ],
  providers: [ReviewScheduleService],
  exports: [ReviewScheduleService],
})
export class ReviewScheduleModule {}
