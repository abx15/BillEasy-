// Billing Controller - Bill management endpoints
import { Controller, Get, Post, Put, Param } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('bills')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  createBill() {
    return { message: 'Create bill' };
  }

  @Get()
  getBills() {
    return { message: 'Get all bills' };
  }

  @Get(':id')
  getBill(@Param('id') id: string) {
    return { message: `Get bill ${id}` };
  }

  @Put(':id/payment')
  updatePayment(@Param('id') id: string) {
    return { message: `Update payment for bill ${id}` };
  }

  @Post(':id/send')
  sendBill(@Param('id') id: string) {
    return { message: `Send bill ${id}` };
  }
}
