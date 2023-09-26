import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ping Pong Documentation.')
    .setDescription('The ping pong description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-doc', app, document);

  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000'],
  });

  // TODO: add morgan !
  // TODO: use helmet for security reasons!

  await app.listen(configService.getOrThrow('PORT'));

  // TODO: remove in production
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
