import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  UnauthorizedException,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { TypeORMError } from "typeorm";
import { LOGGING_SERVICE, LoggingService } from "../logging/logging.service";
import { ForeignKeyConstraintEnum } from "./enums/foreign-key-constraint.enum";
import { GeneralMessageKeyEnum } from "./enums/general-message-key.enum";
import { UniqueKeyConstraintEnum } from "./enums/unique-key-constraint.enum";
import { ApiBadRequestError } from "./errors/api-bad-request-error.model";
import { ApiError } from "./errors/api-error.model";
import { ApiForeignKeyConstraintError } from "./errors/api-foreign-key-constraint-error.model";
import { ApiUniqueKeyConstraintError } from "./errors/api-unique-key-constraint-error.model";
import { ApiBusinessError } from "./errors/api-business-error.model";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private static readonly FORIGN_KEY_PREFIX = "FK";
  private static readonly UNIQUE_KEY_PREFIX = "UQ";
  private static readonly TYPEORM_ERROR_CONSTRAINT_PROPERTY = "constraint";
  private static readonly BAD_REQUEST_EXCEPTION_VALIDATION_ERRORS_PROPERTY =
    "message";
  private static readonly FIREBASE_ERROR_FIELD = "errorInfo";
  private static readonly SENDGRID_ERROR_FIELD = "sendgrid";

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(LOGGING_SERVICE) private loggingService: LoggingService,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let responseBody: ApiError;

    let statusCode: number;

    if (exception instanceof BadRequestException) {
      statusCode = HttpStatus.BAD_REQUEST;
      responseBody = new ApiBadRequestError(
        exception.getResponse()[
          GlobalExceptionFilter.BAD_REQUEST_EXCEPTION_VALIDATION_ERRORS_PROPERTY
        ],
      );
    } else if (
      exception instanceof TypeORMError &&
      exception[GlobalExceptionFilter.TYPEORM_ERROR_CONSTRAINT_PROPERTY]
    ) {
      statusCode = HttpStatus.CONFLICT;
      responseBody = this.createDatabaseError(exception);
    } else if (exception instanceof ForbiddenException) {
      statusCode = HttpStatus.FORBIDDEN;
      responseBody = new ApiError(GeneralMessageKeyEnum.FORBIDDEN);
    } else if (exception instanceof UnauthorizedException) {
      statusCode = HttpStatus.UNAUTHORIZED;
      responseBody = new ApiError(GeneralMessageKeyEnum.UNAUTHORIZED);
    } else if (exception instanceof ApiBusinessError) {
      statusCode = HttpStatus.BAD_REQUEST;
      responseBody = new ApiError(
        GeneralMessageKeyEnum.CREDENTIALS_ERROR_VIOLATION,
      );
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody = new ApiError(GeneralMessageKeyEnum.INTERNAL_SERVER_ERROR);
      this.loggingService.error(
        GlobalExceptionFilter.name,
        exception.message,
        exception.stack,
      );
    }
    this.loggingService.warning(
      GlobalExceptionFilter.name,
      JSON.stringify(responseBody),
      exception.stack,
    );
    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
  private createDatabaseError(
    exception: TypeORMError,
  ): ApiForeignKeyConstraintError | ApiUniqueKeyConstraintError {
    let responseBody:
      | ApiForeignKeyConstraintError
      | ApiUniqueKeyConstraintError;
    if (
      exception[
        GlobalExceptionFilter.TYPEORM_ERROR_CONSTRAINT_PROPERTY
      ].startsWith(GlobalExceptionFilter.FORIGN_KEY_PREFIX)
    ) {
      const constraint: ForeignKeyConstraintEnum =
        exception[GlobalExceptionFilter.TYPEORM_ERROR_CONSTRAINT_PROPERTY];
      responseBody = new ApiForeignKeyConstraintError(constraint);
    } else if (
      exception[
        GlobalExceptionFilter.TYPEORM_ERROR_CONSTRAINT_PROPERTY
      ].startsWith(GlobalExceptionFilter.UNIQUE_KEY_PREFIX)
    ) {
      const constraint: UniqueKeyConstraintEnum =
        exception[GlobalExceptionFilter.TYPEORM_ERROR_CONSTRAINT_PROPERTY];
      responseBody = new ApiUniqueKeyConstraintError(constraint);
    }
    return responseBody;
  }
}
