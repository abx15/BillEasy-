// Root controller - health check endpoint
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return {
      status: 'OK',
      message: 'BillEasy API is running',
      timestamp: new Date().toISOString(),
    };
  }
}
