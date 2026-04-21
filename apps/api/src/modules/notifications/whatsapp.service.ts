// WhatsApp Service - WATI API integration
import { Injectable } from '@nestjs/common';

@Injectable()
export class WhatsAppService {
  sendInvoice() {
    return { message: 'Send invoice via WhatsApp logic' };
  }

  sendReminder() {
    return { message: 'Send payment reminder via WhatsApp logic' };
  }
}
