// Notifications Service - WhatsApp and Email business logic
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  sendWhatsApp() {
    return { message: 'Send WhatsApp notification logic' };
  }

  sendEmail() {
    return { message: 'Send email notification logic' };
  }
}
