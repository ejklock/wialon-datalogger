import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './utils/config/typeparsers';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3333);
}
bootstrap();
