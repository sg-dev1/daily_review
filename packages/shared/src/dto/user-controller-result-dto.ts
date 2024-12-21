import { CreateUserDtoType } from './user-controller-types';

export interface UserEntityDto extends CreateUserDtoType {
  id: number;
}

export interface UserControllerResult {
  success: boolean;
  message: string;
}

export interface UserControllerResultWithData extends UserControllerResult {
  data: UserEntityDto[];
}

export interface UserControllerResultWithSingleData extends UserControllerResult {
  data: UserEntityDto | null;
}
