// Roles Guard - Common role-based access control guard
import { Injectable } from '@nestjs/common';

@Injectable()
export class RolesGuard {
  canActivate() {
    return true; // Placeholder
  }
}
