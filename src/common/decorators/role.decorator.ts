import { UserRole } from '@common/enums';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (roles: UserRole[] | UserRole) =>
  SetMetadata(ROLES_KEY, roles);
