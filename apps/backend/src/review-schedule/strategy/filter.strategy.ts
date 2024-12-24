import { TextSnippet } from '../../text-snippet/entities/text-snippet.entity';
import {
  IReviewSelectionStrategy,
  ReviewFilterType,
} from './review-selection.strategy';

export class FilterReviewSelectionStrategy implements IReviewSelectionStrategy {
  readonly name: string = 'FilterReviewSelectionStrategy';

  selectReviews(
    input: TextSnippet[],
    n: number,
    filter: ReviewFilterType,
  ): TextSnippet[] {
    let result: TextSnippet[] = input;

    if (filter.author !== undefined) {
      result = result.filter(
        (value: TextSnippet) =>
          value.bookAuthor === filter.author ||
          (filter.matchSubstring &&
            value.bookAuthor.indexOf(filter.author as string) !== -1),
      );
    }

    if (filter.title !== undefined) {
      result = result.filter(
        (value: TextSnippet) =>
          value.bookTitle === filter.title ||
          (filter.matchSubstring &&
            value.bookTitle.indexOf(filter.title as string) !== -1),
      );
    }

    if (filter.randomShuffleResult) {
      result = Array.from(result).sort(() => 0.5 - Math.random());
    }

    return result.slice(0, n);
  }
}
