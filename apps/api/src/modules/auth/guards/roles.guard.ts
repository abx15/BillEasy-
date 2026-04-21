// Roles Guard - Protect routes based on user roles
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }

    // Role hierarchy: OWNER > MANAGER > STAFF
    const roleHierarchy = {
      [UserRole.OWNER]: 3,
      [UserRole.MANAGER]: 2,
      [UserRole.STAFF]: 1,
    };

    const userRoleLevel = roleHierarchy[user.role];
    const requiredRoleLevel = Math.max(...requiredRoles.map(role => roleHierarchy[role]));

    return userRoleLevel >= requiredRoleLevel;
  }
}
