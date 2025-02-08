import { TextSnippet } from '../../text-snippet/entities/text-snippet.entity';

export interface ReviewFilterType {
  author?: string;
  title?: string;
  matchSubstring?: boolean;
  randomShuffleResult?: boolean;
}

export interface IReviewSelectionStrategy {
  readonly name: string;
  selectReviews(
    input: TextSnippet[],
    n: number,
    filter: ReviewFilterType,
  ): TextSnippet[];
}

export const reviewFilterTypeToString = (
  reviewFilter: ReviewFilterType,
): string => {
  return (
    `ReviewFilterType {author: ${reviewFilter.author}, title:${reviewFilter.title}, ` +
    `matchSubstring ${reviewFilter.matchSubstring}, randomShuffleResult: ${reviewFilter.randomShuffleResult}}`
  );
};
