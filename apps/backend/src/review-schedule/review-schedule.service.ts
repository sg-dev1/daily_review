import { Injectable } from '@nestjs/common';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { TextSnippetService } from '../text-snippet/text-snippet.service';
import { UserService } from '../user/user.service';
import { CronJob } from 'cron';
import { MailService } from '../mail/mail.service';
import { RandomReviewSelectionStrategy } from './strategy/random.strategy';
import {
  IReviewSelectionStrategy,
  ReviewFilterType,
} from './strategy/review-selection.strategy';
import { FilterReviewSelectionStrategy } from './strategy/filter.strategy';
import { TextSnippet } from '../text-snippet/entities/text-snippet.entity';
import {
  FilterReviewSelectionStrategyType,
  User,
} from '../user/entities/user.entity';

// global mapping of review selection strategies
const reviewSelectionStrategies: { [key: string]: IReviewSelectionStrategy } = {
  [RandomReviewSelectionStrategy.name]: new RandomReviewSelectionStrategy(),
  [FilterReviewSelectionStrategy.name]: new FilterReviewSelectionStrategy(),
};

@Injectable()
export class ReviewScheduleService {
  private debug = true;
  private debugOverwriteConfig = false; //process.env.NODE_ENV === 'development';

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private userService: UserService,
    private textSnippetService: TextSnippetService,
    private mailService: MailService,
  ) {}

  // Setup all review cron jobs 1 sec after application startup
  @Timeout(1000)
  async onStartup(): Promise<void> {
    await this.setup();
  }

  // "0 30 11 * * 1-5"  --> Monday to Friday at 11:30am
  // "0 0 8 * * *"      --> Every day at 8:00am
  // "0 0 8 */2 * *"    --> Every second day at 8:00am (https://serverfault.com/a/204267)
  // "0 0 8 * * 0"      --> Every Sunday at 8:00am (https://crontab.guru/once-a-week)
  private async setup(): Promise<void> {
    if (this.debug) {
      console.log('Initial setup reviews');
    }

    const users = await this.userService.findAll();
    // setup review schedule for all users
    users.forEach((user) => this.addNewUserForReview(user));

    if (this.debug) {
      console.log('Initial review setup completed');
    }
  }

  public addNewUserForReview(user: User): void {
    if (this.debug) {
      console.log('Setup review for user', user.username);
    }

    let reviewFreqAndTime = user.reviewFreqAndTime;
    const numTextSnippetsToSelect = user.numReviewItemsToSend;
    if (this.debugOverwriteConfig) {
      const seconds = 0;
      const minutes = 13;
      const hour = 12;
      reviewFreqAndTime = `${seconds} ${minutes} ${hour} * * *`;
    }

    // NOTE: This may break if the version of cron in backend (currently 3.2.1) does
    //       not match the version used in @nestjs/schedule (see package.json)
    //       Seems that you need to install cron package (in correct version) to get the
    //       CronJob type ...
    const job = new CronJob(reviewFreqAndTime, async () => {
      // 0) Check if user still exists in db (e.g. was it deleted in between)?
      const checkedUser = await this.userService.findOneByUsername(
        user.username,
      );
      if (checkedUser === null) {
        if (this.debug) {
          console.log(
            'User ',
            user.username,
            'could no longer be found in db. Do not send a review.',
          );
        }
        this.removeUserFromReview(user);
        return;
      }

      // user the user fetched from db
      const userFromDb = checkedUser as User;

      // 1) Get all text snippets of a user sorted ascending by review count
      const textSnippets =
        await this.textSnippetService.findAllForUserSortedByReviewCount(
          userFromDb,
        );

      // 2) Apply the selection algorithm
      // a) Most basic random strategy
      // const reviewsToSend = reviewSelectionStrategies[
      //   RandomReviewSelectionStrategy.name
      // ].selectReviews(textSnippets, numTextSnippetsToSelect, {});

      // b) Filter based on a preferred title (could also use author,
      //    could also shuffle result - would destroy the effect of the sort in step (1))
      let reviewFilter: ReviewFilterType = {};
      if (
        userFromDb.filterReviewSelectionStrategyType ===
        FilterReviewSelectionStrategyType.AUTHOR
      ) {
        reviewFilter = {
          author: userFromDb.filterReviewStrategyAuthor,
          matchSubstring: true,
        };
      } else if (
        userFromDb.filterReviewSelectionStrategyType ===
        FilterReviewSelectionStrategyType.TITLE
      ) {
        reviewFilter = {
          title: userFromDb.filterReviewStrategyTitle,
          matchSubstring: true,
        };
      } else if (
        userFromDb.filterReviewSelectionStrategyType ===
        FilterReviewSelectionStrategyType.BOTH
      ) {
        reviewFilter = {
          author: userFromDb.filterReviewStrategyAuthor,
          title: userFromDb.filterReviewStrategyTitle,
          matchSubstring: true,
        };
      }

      if (this.debugOverwriteConfig) {
        reviewFilter = {
          title:
            'How to Talk to Anyone|How To Win Friends and Influence People',
          matchSubstring: true,
        };
      }

      const reviewsToSend: TextSnippet[] = reviewSelectionStrategies[
        FilterReviewSelectionStrategy.name
      ].selectReviews(textSnippets, numTextSnippetsToSelect, reviewFilter);

      if (reviewsToSend.length === 0) {
        console.warn(
          'No reviews to send could be found. Do not send a review email.',
        );
        console.info(
          'reviewFilter=',
          reviewFilter,
          ', numTextSnippetsToSelect=',
          numTextSnippetsToSelect,
          'textSnippets.length=',
          textSnippets.length,
        );
        return;
      }

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
    });

    this.schedulerRegistry.addCronJob(user.username, job);
    this.userService.addSubscriber(user, async (userObj: User) => {
      this.removeUserFromReview(userObj);
      this.addNewUserForReview(userObj);
    });

    job.start();
  }

  removeUserFromReview(user: User): void {
    // delete cronjobs with SchedulerRegistry#deleteCronJob
    this.schedulerRegistry.deleteCronJob(user.username);
  }

  // list all cronjobs with SchedulerRegistry#getCronJobs
}
