import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { version } from '../package.json';

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder().setTitle('API').setVersion(version).addBearerAuth().build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('documentation', app, document);
}
