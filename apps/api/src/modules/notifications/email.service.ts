// Email Service - SendGrid integration
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  sendInvoice() {
    return { message: 'Send invoice via email logic' };
  }

  sendReminder() {
    return { message: 'Send payment reminder via email logic' };
  }
}
