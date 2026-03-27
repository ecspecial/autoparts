import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
    // Используем Fastify вместо Express
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    );

    // Глобальная валидация
    app.useGlobalPipes(
        new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        }),
    );

    // Конфигурация CORS
    app.enableCors({
        origin: [
          'http://localhost:5173',
          'https://control-systema.ru',
          'https://autobody.ru',
          'http://autobody.ru',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      });

    // API префикс
    app.setGlobalPrefix('api');

    // Swagger документация
    const config = new DocumentBuilder()
    .setTitle('API Автозапчастей')
    .setDescription('API для интернет-магазина кузовных автозапчастей')
    .setVersion('1.0')
    .addBearerAuth(
    {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Введите JWT токен',
        in: 'header',
    },
    'JWT-auth',
    )
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0'); // Fastify requires explicit host
    
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`API Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();