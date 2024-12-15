export interface UserEntityDto {
  id: number;
  email: string;
  username: string;
  password: string;
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
