// Validation Pipe - Global validation pipe
import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform() {
    return { message: 'Validation pipe logic' };
  }
}
