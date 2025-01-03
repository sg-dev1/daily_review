import { CreateUserDtoType } from './user-controller-types';

export interface UserDto extends CreateUserDtoType {
  id: number;

  isDisabled: boolean;

  numReviewItemsToSend: number;
  reviewFreqAndTime: string;

  filterReviewSelectionStrategyType: string; // FilterReviewSelectionStrategyType
  filterReviewStrategyAuthor: string;
  filterReviewStrategyTitle: string;
}

export interface UserControllerResult {
  success: boolean;
  message: string;
}

export interface UserControllerResultWithData extends UserControllerResult {
  data: UserDto[];
}

export interface UserControllerResultWithSingleData extends UserControllerResult {
  data: UserDto | null;
}
