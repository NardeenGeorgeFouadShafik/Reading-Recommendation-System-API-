import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { corsOptions } from "./common/configuration/cors-options";
import { ConfigurationEnum } from "./common/configuration/configuration.enum";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { LocalLoggingService } from "./common/logging/local-logging.service";
import { GlobalExceptionFilter } from "./common/exception-handling/global-exception.filter";
import { LOGGING_SERVICE } from "./common/logging/logging.service";
import { USER_SERVICE } from "./domain/services/user.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
  });

  const configService = app.get(ConfigService);
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new GlobalExceptionFilter(
      httpAdapterHost,
      await app.resolve(LOGGING_SERVICE),
    ),
  );

  corsOptions.origin = configService
    .get(ConfigurationEnum.CORS_ORIGIN)
    ?.split(",");
  app.enableCors(corsOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => new BadRequestException(errors),
      transform: true,
    }),
  );

  if (configService.get(ConfigurationEnum.ADMINS)) {
    const userService = app.get(USER_SERVICE);
    userService.createFirstAdmins();
  }
  const port = configService.get(ConfigurationEnum.SERVER_PORT);
  await app.listen(port);
}
bootstrap().catch((error) => {
  new LocalLoggingService(new ConfigService()).critical(
    "Main",
    error.message,
    error.stack,
  );
  process.exit();
});
