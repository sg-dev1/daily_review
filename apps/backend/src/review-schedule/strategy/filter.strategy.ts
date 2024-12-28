import { TextSnippet } from '../../text-snippet/entities/text-snippet.entity';
import {
  IReviewSelectionStrategy,
  ReviewFilterType,
} from './review-selection.strategy';

export class FilterReviewSelectionStrategy implements IReviewSelectionStrategy {
  readonly name: string = 'FilterReviewSelectionStrategy';

  private genericFilter(
    input: TextSnippet[],
    filterText: string,
    propertyToFilter: string,
    filter: ReviewFilterType,
  ): TextSnippet[] {
    const filterTextLowercase = filterText.toLowerCase();
    const filterList: string[] = filterTextLowercase.split('|');

    return input.filter((value: TextSnippet) => {
      const filterProperty = (value as any)[propertyToFilter];

      if (filterProperty === undefined) {
        throw new Error(
          `Filter property '${filterProperty}' could not be found on type TextSnippet`,
        );
      }

      const filterPropertyLowercase = filterProperty.toLowerCase();
      return (
        filterList.includes(filterPropertyLowercase) ||
        (filter.matchSubstring &&
          filterList
            .map(
              (filterItem) =>
                filterPropertyLowercase.indexOf(filterItem) !== -1,
            )
            .reduce((prev, current) => prev || current))
      );
    });
  }

  selectReviews(
    input: TextSnippet[],
    n: number,
    filter: ReviewFilterType,
  ): TextSnippet[] {
    let result: TextSnippet[] = input;

    if (filter.author !== undefined) {
      result = this.genericFilter(result, filter.author, 'bookAuthor', filter);
    }

    if (filter.title !== undefined) {
      result = this.genericFilter(result, filter.title, 'bookTitle', filter);
    }

    if (filter.randomShuffleResult) {
      result = Array.from(result).sort(() => 0.5 - Math.random());
    }

    return result.slice(0, n);
  }
}
