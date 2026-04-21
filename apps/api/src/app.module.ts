// Root application module - imports all feature modules
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { BusinessModule } from './modules/business/business.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ProductsModule } from './modules/products/products.module';
import { BillingModule } from './modules/billing/billing.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReportsModule } from './modules/reports/reports.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    BusinessModule,
    CustomersModule,
    ProductsModule,
    BillingModule,
    NotificationsModule,
    PaymentsModule,
    ReportsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
