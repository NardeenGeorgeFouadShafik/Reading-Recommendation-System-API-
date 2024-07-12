export const LOGGING_SERVICE = Symbol("LOGGING_SERVICE");
export interface LoggingService {
  debug(context: string, message: string);
  info(context: string, message: string);
  notice(context: string, message: string);
  warning(context: string, message: string, stackTrace?: string);
  error(context: string, message: string, stackTrace?: string);
  critical(context: string, message: string, stackTrace?: string);
  alert(context: string, message: string, stackTrace?: string);
  emergency(context: string, message: string, stackTrace?: string);
}
