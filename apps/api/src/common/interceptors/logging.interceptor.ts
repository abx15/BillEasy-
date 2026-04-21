// Logging Interceptor - Request/response logging
import { Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept() {
    return { message: 'Logging interceptor logic' };
  }
}
