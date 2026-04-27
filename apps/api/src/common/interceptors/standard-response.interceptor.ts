// Standard Response Interceptor - Standardize API responses
import { 
  Injectable, 
  NestInterceptor, 
  ExecutionContext, 
  CallHandler,
  HttpStatus 
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class StandardResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    
    return next.handle().pipe(
      tap((data) => {
        const endTime = Date.now();
        const processingTime = endTime - startTime;
        
        // Standardize response format
        let response = data;
        
        // If response is not already standardized, wrap it
        if (typeof data === 'object' && data !== null) {
          const hasSuccess = data.hasOwnProperty('success') || 
                           data.hasOwnProperty('data') ||
                           data.hasOwnProperty('error') ||
                           (data.statusCode !== undefined);
          
          if (!hasSuccess) {
            response = {
              success: true,
              data: data,
              message: 'Request completed successfully',
              timestamp: new Date().toISOString(),
              processingTime: processingTime
            };
          }
        }
        
        // Add processing time to response if not already present
        if (typeof response === 'object' && response.processingTime === undefined) {
          response.processingTime = processingTime;
        }
      })
    );
  }
}
