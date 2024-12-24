import { TextSnippet } from '../../text-snippet/entities/text-snippet.entity';
import {
  IReviewSelectionStrategy,
  ReviewFilterType,
} from './review-selection.strategy';

export class RandomReviewSelectionStrategy implements IReviewSelectionStrategy {
  readonly name: string = 'RandomReviewSelectionStrategy';

  selectReviews(
    input: TextSnippet[],
    n: number,
    filter: ReviewFilterType,
  ): TextSnippet[] {
    const shuffled = Array.from(input).sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }
}
