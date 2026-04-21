// JWT Auth Guard - Common JWT authentication guard
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard {
  canActivate() {
    return true; // Placeholder
  }
}
