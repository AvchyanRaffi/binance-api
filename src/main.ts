import { ClassSerializerInterceptor, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import * as helmet from 'helmet';
import { SharedModule } from './shared/shared.module';
import { ConfigService } from './shared/services/config.service';
import { HttpExceptionFilter } from './filters/bad-request.filter';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule,
        new ExpressAdapter(),
        { cors: true },
    );
    app.enable('trust proxy');
    app.use(helmet());

    const reflector = app.get(Reflector);

    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(reflector),
    );

  app.useGlobalFilters(
    new HttpExceptionFilter(reflector),
  );

    app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          transform: true,
          dismissDefaultMessages: false,
          validationError: {
            target: true,
          },
          exceptionFactory: (errors) =>
            new UnprocessableEntityException(errors),
        }),
    );

    const configService = app.select(SharedModule).get(ConfigService);

    if (['development'].includes(configService.nodeEnv)) {
        setupSwagger(app);
    }

    const port = configService.getNumber('PORT');
    await app.listen(port);

    console.info(`server running on port ${port}`);
}
bootstrap();
