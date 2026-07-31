import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import * as express from 'express';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Only use raw body for Stripe webhook route to allow signature verification
  app.use('/api/webhook/stripe', express.raw({ type: 'application/json' }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server listening on http://localhost:${port}`);
}
bootstrap();
