import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { validationSchema } from "./common/configuration/environment-validation-schema";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClsModule } from "nestjs-cls";
import { ConfigurationEnum } from "./common/configuration/configuration.enum";
import { LOGGING_SERVICE } from "./common/logging/logging.service";
import { LocalLoggingService } from "./common/logging/local-logging.service";
import { v4 as uuid } from "uuid";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { JwtStrategy } from "./adapters/rest/guards/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { DOMAIN_SERVICES } from "./domain/services/implementation/domain-services";
import { DATABASE_REPOS } from "./adapters/typeorm/repos/database-repos";
import { DATABASE_ENTITIES } from "./adapters/typeorm/entities/database-entities";
import { REST_CONTROLLERS } from "./adapters/rest/controllers/rest-controllers";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env.dev",
      validationSchema: validationSchema,
    }),
    TypeOrmModule.forFeature(DATABASE_ENTITIES),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: "postgres",
        autoLoadEntities: true,
        host: configService.get(ConfigurationEnum.DB_HOST),
        port: configService.get(ConfigurationEnum.DB_PORT),
        username: configService.get(ConfigurationEnum.DB_USERNAME),
        password: configService.get(ConfigurationEnum.DB_PASSWORD),
        database: configService.get(ConfigurationEnum.DB_DATABASE),
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: false,
        migrationsRun: true,
        migrations: [__dirname + "/migrations/*-migration.{ts,js}"],

        poolSize: configService.get(ConfigurationEnum.DB_POOL_SIZE),
      }),
    }),
    ClsModule.forRoot({
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: Request) => req.headers["X-Request-Id"] ?? uuid(),
      },
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(ConfigurationEnum.JWT_SECRET),
        signOptions: { expiresIn: "60m" },
      }),
    }),
    PassportModule,
  ],
  controllers: [...REST_CONTROLLERS],
  providers: [
    {
      provide: LOGGING_SERVICE,
      useClass: LocalLoggingService,
    },
    ...DOMAIN_SERVICES,
    ...DATABASE_REPOS,
    JwtStrategy,
  ],
})
export class AppModule {}
