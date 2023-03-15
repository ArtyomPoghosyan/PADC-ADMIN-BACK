import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import * as compression from 'compression';
import { HttpExceptionFilter } from '@common/filters';
import * as bodyParser from 'body-parser';
import { buildResponse, ErrorHandler } from '@common/helpers';
import { NestExpressApplication } from '@nestjs/platform-express';

const PORT = process.env.PORT || 5000;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });
  app.enableCors();
  app.use(compression());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      disableErrorMessages: true,
      exceptionFactory: (errors: ValidationError[]): void => {
        const message = ErrorHandler(errors);

        throw buildResponse(false, { message });
      },
    }),
  );
  await app.listen(PORT);
}
bootstrap();
