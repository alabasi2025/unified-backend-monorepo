/**
 * SEMOP ERP - API Gateway
 * Version: 2.4.0
 */
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Set global prefix
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  
  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('SEMOP ERP API')
    .setDescription('SEMOP ERP System - Comprehensive API Documentation')
    .setVersion('2.4.0')
    .addTag('Billing', 'Billing Engine')
    .addTag('Wallet', 'Wallet Service')
    .addTag('Assets', 'Assets Management')
    .addTag('SCM', 'Supply Chain Management')
    .addTag('Notifications', 'Notifications System')
    .addTag('Configuration', 'System Configuration')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(
    `📚 API Documentation: http://localhost:${port}/${globalPrefix}/docs`
  );
}

bootstrap();
