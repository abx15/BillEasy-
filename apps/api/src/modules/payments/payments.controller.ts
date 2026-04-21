// Payments Controller - Payment processing endpoints
import { Controller, Get, Post, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  createPayment() {
    return { message: 'Create payment' };
  }

  @Get(':billId')
  getPaymentsByBill(@Param('billId') billId: string) {
    return { message: `Get payments for bill ${billId}` };
  }

  @Post('razorpay/order')
  createRazorpayOrder() {
    return { message: 'Create Razorpay order' };
  }

  @Post('razorpay/verify')
  verifyRazorpayPayment() {
    return { message: 'Verify Razorpay payment' };
  }
}
