import { ILogger } from 'js-logger/src/types.d';
import { LogChannel } from './Logger';

export default class JsLogChannel implements LogChannel {
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  trace(...messages: any[]): void {
    this.logger.trace(...messages);
  }

  debug(...messages: any[]): void {
    this.logger.debug(...messages);
  }

  info(...messages: any[]) {
    this.logger.info(...messages);
  }

  warn(...messages: any[]): void {
    this.logger.warn(...messages);
  }

  error(...messages: any[]): void {
    this.logger.error(...messages);
  }
}
