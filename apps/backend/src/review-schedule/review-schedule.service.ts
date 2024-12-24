import { Injectable } from '@nestjs/common';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { TextSnippetService } from '../text-snippet/text-snippet.service';
import { UserService } from '../user/user.service';
import { CronJob } from 'cron';
import { MailService } from '../mail/mail.service';

// TODO setup() needs to be rerun when new user is added (or it needs to be only run for this user)
@Injectable()
export class ReviewScheduleService {
  private debug = true;

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private userService: UserService,
    private textSnippetService: TextSnippetService,
    private mailService: MailService,
  ) {}

  // Setup all review cron jobs 1 sec after application startup
  @Timeout(1000)
  async onStartup() {
    await this.setup();
  }

  // "0 30 11 * * 1-5"  --> Monday to Friday at 11:30am
  // "0 0 8 * * *"      --> Every day at 8:00am
  async setup() {
    if (this.debug) {
      console.log('Setup reviews');
    }

    const users = await this.userService.findAll();
    // setup review schedule for all users
    users.forEach((user) => {
      if (this.debug) {
        console.log('Setup review for user', user.username);
      }

      const seconds = 0;
      const minutes = 0;
      const hour = 8; // TODO take this review interval from a user's config
      const numTextSnippetsToSelect = 6; // TODO get this from user's config
      // NOTE: This may break if the version of cron in backend (currently 3.2.1) does
      //       not match the version used in @nestjs/schedule (see package.json)
      //       Seems that you need to install cron package (in correct version) to get the
      //       CronJob type ...
      const job = new CronJob(
        `${seconds} ${minutes} ${hour} * * *`,
        async () => {
          const textSnippets =
            await this.textSnippetService.findAllForUser(user);
          const shuffled = Array.from(textSnippets).sort(
            () => 0.5 - Math.random(),
          );
          await this.mailService.sendReviewMail(
            user,
            'Your daily review',
            shuffled.slice(0, numTextSnippetsToSelect),
          );

          if (this.debug) {
            console.log('Review email for user ', user.username, 'sent');
          }
        },
      );

      this.schedulerRegistry.addCronJob(user.username, job);
      job.start();
    });

    if (this.debug) {
      console.log('Review setup completed');
    }
  }

  // delete cronjobs with SchedulerRegistry#deleteCronJob
  // list all cronjobs with SchedulerRegistry#getCronJobs
}
