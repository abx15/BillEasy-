// Reports Controller - Analytics and reporting endpoints
import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily')
  getDailyReport() {
    return { message: 'Get daily report' };
  }

  @Get('monthly')
  getMonthlyReport() {
    return { message: 'Get monthly report' };
  }

  @Get('top-products')
  getTopProducts() {
    return { message: 'Get top products' };
  }

  @Get('revenue')
  getRevenue(@Query('from') from: string, @Query('to') to: string) {
    return { message: `Get revenue from ${from} to ${to}` };
  }
}
