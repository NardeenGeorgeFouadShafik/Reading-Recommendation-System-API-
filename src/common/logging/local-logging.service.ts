import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClsService } from "nestjs-cls";
import { ConfigurationEnum } from "../configuration/configuration.enum";
import { LogSeverity } from "./log-severity.enum";
import { LoggingService } from "./logging.service";

@Injectable()
export class LocalLoggingService implements LoggingService {
  logSeverities: string[];

  constructor(
    configService: ConfigService,
    private readonly cls?: ClsService,
  ) {
    this.logSeverities = configService
      .get<string>(ConfigurationEnum.LOG_SEVERITIES)
      .split(",");
  }

  debug(context: string, message: string) {
    if (this.isLogSeverityEnabled(LogSeverity.DEBUG)) {
      this.formatMessageAndLog(context, message, LogSeverity.DEBUG);
    }
  }
  info(context: string, message: string) {
    if (this.isLogSeverityEnabled(LogSeverity.INFO)) {
      this.formatMessageAndLog(context, message, LogSeverity.INFO);
    }
  }
  notice(context: string, message: string) {
    if (this.isLogSeverityEnabled(LogSeverity.NOTICE)) {
      this.formatMessageAndLog(context, message, LogSeverity.NOTICE);
    }
  }
  warning(context: string, message: string, stackTrace?: string) {
    if (this.isLogSeverityEnabled(LogSeverity.WARNING)) {
      this.formatMessageAndLog(
        context,
        message,
        LogSeverity.WARNING,
        stackTrace,
      );
    }
  }
  error(context: string, message: string, stackTrace?: string) {
    if (this.isLogSeverityEnabled(LogSeverity.ERROR)) {
      this.formatMessageAndLog(context, message, LogSeverity.ERROR, stackTrace);
    }
  }
  critical(context: string, message: string, stackTrace?: string) {
    if (this.isLogSeverityEnabled(LogSeverity.CRITICAL)) {
      this.formatMessageAndLog(
        context,
        message,
        LogSeverity.CRITICAL,
        stackTrace,
      );
    }
  }
  alert(context: string, message: string, stackTrace?: string) {
    if (this.isLogSeverityEnabled(LogSeverity.ALERT)) {
      this.formatMessageAndLog(context, message, LogSeverity.ALERT, stackTrace);
    }
  }
  emergency(context: string, message: string, stackTrace?: string) {
    if (this.isLogSeverityEnabled(LogSeverity.EMERGENCY)) {
      this.formatMessageAndLog(
        context,
        message,
        LogSeverity.EMERGENCY,
        stackTrace,
      );
    }
  }

  formatMessageAndLog(
    context: string,
    message: string,
    logLevel: LogSeverity,
    stackTrace?: string,
  ) {
    const pidMessage = `[Nest] ${process.pid}  -`;
    const contextMessage = context ? `[${context}] ` : "";
    const formattedLogLevel = LogSeverity[logLevel]
      .toUpperCase()
      .padStart(7, " ");
    const messageWithTraceId =
      this.cls && this.cls.getId()
        ? `<${this.cls.getId()}> ${message}`
        : message;
    const formattedStackTrace = stackTrace ? `\n ${stackTrace}` : "";
    const formattedMessage = `${pidMessage} ${this.getTimestamp()} ${formattedLogLevel} ${contextMessage} ${messageWithTraceId} ${formattedStackTrace}`;
    console.log(formattedMessage);
  }

  getTimestamp() {
    const localeStringOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      day: "2-digit",
      month: "2-digit",
    };
    return new Date(Date.now()).toLocaleString(undefined, localeStringOptions);
  }

  isLogSeverityEnabled(logSeverity: LogSeverity) {
    return this.logSeverities.some(
      (configLogSeverity) => configLogSeverity === LogSeverity[logSeverity],
    );
  }
}
