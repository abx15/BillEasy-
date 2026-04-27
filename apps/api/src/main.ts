// NestJS Bootstrap - Main application entry point
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { StandardResponseInterceptor } from './common/interceptors/standard-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Add global interceptor
  app.useGlobalInterceptors(new StandardResponseInterceptor());

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3000', 'http://localhost:3000'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('BillEasy API')
    .setDescription('Billing software for Indian small businesses')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.API_PORT || 3001);
}
bootstrap();
