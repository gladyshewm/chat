import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 5000;
  const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
  };

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(corsOptions);
  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
bootstrap();
