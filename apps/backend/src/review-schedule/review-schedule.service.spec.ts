import { Test, TestingModule } from '@nestjs/testing';
import { ReviewScheduleService } from './review-schedule.service';
import { FilterReviewSelectionStrategy } from './strategy/filter.strategy';
import { ReviewFilterType } from './strategy/review-selection.strategy';
import { TextSnippet } from '../text-snippet/entities/text-snippet.entity';
import { User } from '../user/entities/user.entity';
import { UserDto } from '@repo/shared';

describe('ReviewScheduleService', () => {
  let service: ReviewScheduleService;

  beforeEach(async () => {
    /*
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewScheduleService],
    }).compile();

    service = module.get<ReviewScheduleService>(ReviewScheduleService);
    */
  });

  it('dummy', () => {});
  /*
  it('should be defined', () => {
    expect(service).toBeDefined();
  });*/

  const createDummyTextSnippet = (
    author: string,
    title: string,
  ): TextSnippet => {
    const snippet = new TextSnippet();
    snippet.bookAuthor = author;
    snippet.bookTitle = title;
    return snippet;
  };

  const dummyUser: User = new User();
  const data: TextSnippet[] = [
    createDummyTextSnippet(
      'Dale Carnegie',
      'How To Win Friends and Influence People',
    ),
    createDummyTextSnippet(
      'Dale Carnegie',
      'how TO WIN FriendS and Influence People',
    ),
    createDummyTextSnippet(
      'Carnegie',
      'How To Win Friends and Influence People',
    ),

    createDummyTextSnippet(
      'James Clear',
      'Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    ),
    createDummyTextSnippet(
      'Clear',
      'Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    ),
    createDummyTextSnippet('James Clear', 'Atomic Habits'),

    createDummyTextSnippet(
      'Florian Wagner and Oliver Noelting',
      'Rente mit 40: Finanzielle Freiheit und Glück durch Frugalismus (German Edition)',
    ),

    createDummyTextSnippet(
      'Robert Waldinger, Marc Schulz, and Ulrike Kretschmer',
      'The Good Life ... und wie es gelingen kann: Erkenntnisse aus der weltweit längsten Studie über ein erfülltes Leben - New York Times Bestseller (German Edition)',
    ),

    createDummyTextSnippet(
      'MJ DeMarco',
      'The Millionaire Fastlane: Crack the Code to Wealth and Live Rich for a Lifetime',
    ),

    createDummyTextSnippet(
      'Leil Lowndes',
      'How to Talk to Anyone: 92 Little Tricks for Big Success in Relationships',
    ),
    createDummyTextSnippet(
      'Lowndes',
      'How to Talk to Anyone: 92 Little Tricks for Big Success in Relationships',
    ),
    createDummyTextSnippet('Leil Lowndes', 'How to Talk to Anyone'),
  ];

  it('test filter strategy 1', () => {
    const reviewStrategy = new FilterReviewSelectionStrategy();
    const reviewFilter: ReviewFilterType = {
      title: 'How to Talk to Anyone|How To Win Friends and Influence People',
      matchSubstring: true,
    };

    const output: TextSnippet[] = reviewStrategy.selectReviews(
      data,
      6,
      reviewFilter,
    );

    //console.log('Output', output);
    expect(output).toHaveLength(6);
  });

  it('test filter strategy 2', () => {
    const reviewStrategy = new FilterReviewSelectionStrategy();
    const reviewFilter: ReviewFilterType = {
      title: 'How to Talk to Anyone|How To Win Friends and Influence People',
      matchSubstring: false,
    };

    const output: TextSnippet[] = reviewStrategy.selectReviews(
      data,
      6,
      reviewFilter,
    );

    //console.log('Output', output);
    expect(output).toHaveLength(4);
  });

  it('test filter strategy 3', () => {
    const reviewStrategy = new FilterReviewSelectionStrategy();
    const reviewFilter: ReviewFilterType = {
      title: 'How to Talk to Anyone',
      matchSubstring: true,
    };

    const output: TextSnippet[] = reviewStrategy.selectReviews(
      data,
      6,
      reviewFilter,
    );

    //console.log('Output', output);
    expect(output).toHaveLength(3);
  });
});
