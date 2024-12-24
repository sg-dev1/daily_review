import { Injectable } from '@nestjs/common';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { TextSnippetService } from '../text-snippet/text-snippet.service';
import { UserService } from '../user/user.service';
import { CronJob } from 'cron';
import { MailService } from '../mail/mail.service';
import { RandomReviewSelectionStrategy } from './strategy/random.strategy';
import { IReviewSelectionStrategy } from './strategy/review-selection.strategy';
import { FilterReviewSelectionStrategy } from './strategy/filter.strategy';
import { TextSnippet } from '../text-snippet/entities/text-snippet.entity';

// global mapping of review selection strategies
const reviewSelectionStrategies: { [key: string]: IReviewSelectionStrategy } = {
  [RandomReviewSelectionStrategy.name]: new RandomReviewSelectionStrategy(),
  [FilterReviewSelectionStrategy.name]: new FilterReviewSelectionStrategy(),
};

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
      const minutes = 43;
      const hour = 17; // TODO take this review interval from a user's config
      const numTextSnippetsToSelect = 6; // TODO get this from user's config
      // NOTE: This may break if the version of cron in backend (currently 3.2.1) does
      //       not match the version used in @nestjs/schedule (see package.json)
      //       Seems that you need to install cron package (in correct version) to get the
      //       CronJob type ...
      const job = new CronJob(
        `${seconds} ${minutes} ${hour} * * *`,
        async () => {
          // 1) Get all text snippets of a user sorted ascending by review count
          const textSnippets =
            await this.textSnippetService.findAllForUserSortedByReviewCount(
              user,
            );

          // 2) Apply the selection algorithm
          // a) Most basic random strategy
          // const reviewsToSend = reviewSelectionStrategies[
          //   RandomReviewSelectionStrategy.name
          // ].selectReviews(textSnippets, numTextSnippetsToSelect, {});

          // b) Filter based on a preferred title (could also use author,
          //    could also shuffle result - would destroy the effect of the sort in step (1))
          const reviewsToSend: TextSnippet[] = reviewSelectionStrategies[
            FilterReviewSelectionStrategy.name
          ].selectReviews(textSnippets, numTextSnippetsToSelect, {
            title: 'How to Talk to Anyone',
            matchSubstring: true,
          });

          // 3) Send the email
          await this.mailService.sendReviewMail(
            user,
            'Your daily review',
            reviewsToSend,
          );

          // 4) Update review count in database
          const reviewsToUpdate: TextSnippet[] = reviewsToSend.map(
            (textSnippet) => ({
              ...textSnippet,
              reviewCount: textSnippet.reviewCount + 1,
            }),
          );
          await this.textSnippetService.updateAll(reviewsToUpdate);

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
