import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
const fs = require('fs');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger API Document Migration
  const config = new DocumentBuilder()
    .setTitle('Swagger Document for Test Assignment')
    .setDescription('This is a simple swagger document for testing')
    .setVersion('1.0')
    .addBasicAuth(
      { type: "http", scheme: 'Bearer', in: 'Header', bearerFormat: 'Bearer', name: 'Authorization' }, 'access-token',
    )
    .addBasicAuth(
      { type: "http", scheme: 'Bearer', in: 'Header', bearerFormat: 'Bearer', name: 'Authorization' }, 'refresh-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);

  fs.writeFileSync("./swagger-spec.json", JSON.stringify(document));
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}

bootstrap();