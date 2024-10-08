import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import * as cookieParser from 'cookie-parser';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 5000;

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
    exposedHeaders: ['X-New-Access-Token'],
  };

  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.enableCors(corsOptions);
  app.use(cookieParser());

  await app.listen(PORT, () =>
    console.log(`Server started on http://localhost:${PORT}/graphql`),
  );
}
bootstrap();
