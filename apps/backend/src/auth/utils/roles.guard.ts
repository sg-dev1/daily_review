import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      // roles are not checked if not logged in
      return true;
    }

    if (user.isDisabled) {
      console.info(
        `RolesGuard - given user '${user.username}' is disabled. Authorization failed.`,
      );
      return false;
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      // No Authorization found, always allow
      return true;
    }
    if (user.isAdmin) {
      // Admin is always allowed
      return true;
    }

    if (requiredRoles.includes(Role.Admin)) {
      // Normal user tries to access Admin protected endpoint -> not allow
      return false;
    } else {
      // Normal user accessing non Admin protected endpoint --> allow
      return true;
    }
  }
}
