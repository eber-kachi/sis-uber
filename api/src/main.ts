import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';
import { setupSwagger } from './setup-swagger';
import { TransformationInterceptor } from './interceptors/transform.interceptor';
import express from 'express';
import { join } from 'path';

async function bootstrap() {
  const loger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.use('/public', express.static(join(__dirname, '..', 'public'))); // para public
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // app.useGlobalInterceptors(new ClassSerializerInterceptor(
  //   app.get(Reflector))
  // );
  // app.useGlobalInterceptors(new TransformationInterceptor());
  const configService = app.select(SharedModule).get(ConfigService);

  if (['development', 'staging'].includes(configService.nodeEnv)) {
    // setupSwagger(app);
  }
  const port = configService.getNumber('PORT');

  app.enableCors({ origin: '*', credentials: true });
  await app.listen(port);

  // app.
  loger.log(`app Run port: ${port}`);
  // console.log(join(__dirname, '..', 'public'));
}

bootstrap();
