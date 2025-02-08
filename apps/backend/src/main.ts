import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as expressBasicAuth from 'express-basic-auth';

const setupSwagger = (app: INestApplication): void => {
  if (process.env.NODE_ENV === 'production') {
    app.use(
      ['/api-docs', '/api-docs-json', '/api-docs-yaml'],
      expressBasicAuth({
        challenge: true,
        // this is the username and password used to authenticate
        users: { admin: process.env.SWAGGER_ADMIN_PASSWORD || 'pwd' },
      }),
    );
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Daily Book Review')
    .setDescription('This is the description of my app')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'My App (custom title)',
  };
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api-docs', app, document, customOptions);
};

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  app.enableCors({
    origin: function (origin, callback) {
      callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  setupSwagger(app);

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 7777);
}

bootstrap();
