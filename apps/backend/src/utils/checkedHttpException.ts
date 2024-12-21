import { HttpException } from '@nestjs/common';

export const checkedHttpException = (error: unknown): string => {
  let result = '';
  if (error instanceof HttpException) {
    result = error.message;
  } else {
    result = 'Unknown error: ' + String(error);
  }
  return result;
};
