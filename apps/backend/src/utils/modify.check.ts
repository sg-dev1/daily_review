import { ForbiddenException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';

export const checkedModifyOperation = (
  operationExecutedBy: User,
  userIdToModify: number,
): void => {
  if (operationExecutedBy.isAdmin) {
    return;
  }
  if (operationExecutedBy.isDisabled) {
    throw new ForbiddenException('Disabled user not allowed');
  }
  if (operationExecutedBy.id === userIdToModify) {
    // allow modify yourself
    return;
  }

  throw new ForbiddenException('Operation forbidden');
};
