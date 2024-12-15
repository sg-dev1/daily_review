export interface UserControllerResult {
  success: boolean;
  message: string;
}

// TODO fixme, get rid of any
export interface UserControllerResultWithData extends UserControllerResult {
  data: any[];
}

// TODO fixme, get rid of any
export interface UserControllerResultWithSingleData extends UserControllerResult {
  data: any | null;
}
