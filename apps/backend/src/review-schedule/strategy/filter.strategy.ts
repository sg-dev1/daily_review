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
      const filterAuthorLowercase = filter.author.toLowerCase();
      result = result.filter((value: TextSnippet) => {
        const bookAuthorLowercase = value.bookAuthor.toLowerCase();
        return (
          bookAuthorLowercase === filterAuthorLowercase ||
          (filter.matchSubstring &&
            bookAuthorLowercase.indexOf(filterAuthorLowercase) !== -1)
        );
      });
    }

    if (filter.title !== undefined) {
      const filterTitleLowercase = filter.title.toLowerCase();
      result = result.filter((value: TextSnippet) => {
        const bookTitleLowercase = value.bookTitle.toLowerCase();
        return (
          bookTitleLowercase === filterTitleLowercase ||
          (filter.matchSubstring &&
            bookTitleLowercase.indexOf(filterTitleLowercase) !== -1)
        );
      });
    }

    if (filter.randomShuffleResult) {
      result = Array.from(result).sort(() => 0.5 - Math.random());
    }

    return result.slice(0, n);
  }
}
