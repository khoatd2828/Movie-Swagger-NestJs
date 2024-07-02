import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(express.static('.'));
  //yarn add @nestjs/swagger swagger-ui-express
  const config = new DocumentBuilder()
    .setTitle('Movie')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const options = {
    explorer: true,
    swaggerOptions: {
        persistAuthorization: true,
    },
};
  SwaggerModule.setup('/swagger', app, document, options);
  await app.listen(8080);
}
bootstrap();
