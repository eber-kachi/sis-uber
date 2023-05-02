import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';
import { setupSwagger } from './setup-swagger';

async function bootstrap() {
  const loger = new Logger();
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const configService = app.select(SharedModule).get(ConfigService);

  if (['development', 'staging'].includes(configService.nodeEnv)) {
    setupSwagger(app);
  }
  const port = configService.getNumber('PORT');

  app.enableCors({ origin: '*',  credentials:true});
  await app.listen(port);

  // app.
  loger.log(`app Run port: ${port}`);
}

bootstrap();
