import { CreateUserDtoType } from './user-controller-types';

export interface UserDto extends CreateUserDtoType {
  id: number;

  numReviewItemsToSend: number;
  reviewFreqAndTime: string;
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
