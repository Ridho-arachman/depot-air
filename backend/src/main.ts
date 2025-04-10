import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
  .then(() => {
    console.log('Application started successfully');
  })
  .catch((error) => {
    console.error('Failed to start application:', error);
  });
