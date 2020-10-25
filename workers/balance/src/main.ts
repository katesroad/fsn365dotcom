import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { config } from './config';

async function bootstrap() {
  const appConfig = config();
  const { name, ...rabbitmq } = appConfig.app;
  const logger = new Logger(name);

  const app = await NestFactory.createMicroservice(AppModule, rabbitmq);

  const msg = `\n\n
=========================================================
        ${name} started...
=========================================================
    `;

  await app.listen(() => logger.log(msg));
}
bootstrap();
