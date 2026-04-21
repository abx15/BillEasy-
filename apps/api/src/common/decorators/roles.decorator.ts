// Roles Decorator - Role-based access control decorator
import { SetMetadata } from '@nestjs/common';

export const Roles = SetMetadata('roles', () => {
  return { message: 'Roles decorator logic' };
});
