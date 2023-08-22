import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = +process.env.PORT;
  const config = new DocumentBuilder()
    .setTitle('W3 Examination')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('W3 Examination')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port || 5000);
}
bootstrap();
