/*
// TODO this is duplicated, there is also a copy in backend
//   - However having it in central place caused ERR_UNSUPPORTED_DIR_IMPORT in nestjs
export enum FilterReviewSelectionStrategyTypeCopy {
  AUTHOR = 'author',
  TITLE = 'title',
  BOTH = 'both',
}

export const FilterReviewSelectionStrategyTypeItems: string[] = [
  FilterReviewSelectionStrategyTypeCopy.AUTHOR,
  FilterReviewSelectionStrategyTypeCopy.TITLE,
  FilterReviewSelectionStrategyTypeCopy.BOTH,
];

export type FilterReviewSelectionStrategyTransferType =
  | FilterReviewSelectionStrategyTypeCopy.AUTHOR
  | FilterReviewSelectionStrategyTypeCopy.TITLE
  | FilterReviewSelectionStrategyTypeCopy.BOTH;
  */

export interface CreateUserDtoType {
  username: string;
  password: string;
  email: string;
  isAdmin: boolean;
}

export interface UpdateUserDtoType extends Partial<CreateUserDtoType> {
  isDisabled?: boolean;

  numReviewItemsToSend?: number;

  reviewFreqAndTime?: string;

  filterReviewSelectionStrategyType?: string; // // FilterReviewSelectionStrategyType

  filterReviewStrategyAuthor?: string;
  filterReviewStrategyTitle?: string;
}
