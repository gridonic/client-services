import Log from 'js-logger';
import { ILogLevel } from 'js-logger/src/types.d';
import { Logger, LoggerHandler, LogLevel } from './Logger';
import Lazy from '../decorator/lazy';

/**
 * A logger implementation for usage in the services.
 *
 * By the default, writes to the window console.
 *
 * Implemented using js-logger
 * @see https://github.com/jonnyreeves/js-logger
 */
export default class JsLogger implements Logger {
  private handlers: LoggerHandler[] = [];

  constructor(logLevel: LogLevel) {
    Log.useDefaults({
      defaultLevel: this.logLevelMap.get(logLevel),
    });

    this.createDefaultHandler()
      .setupJsLoggerHandler();
  }

  public addHandler(handler: LoggerHandler) {
    this.handlers.push(handler);
  }

  public trace(...messages: any[]): void {
    Log.trace(messages);
  }

  public debug(...messages: any[]): void {
    Log.debug(messages);
  }

  public info(...messages: any[]): void {
    Log.info(messages);
  }

  public warn(...messages: any[]): void {
    Log.warn(messages);
  }

  public error(...messages: any[]): void {
    Log.error(messages);
  }

  private createDefaultHandler() {
    const defaultHandler = Log.createDefaultHandler();

    this.addHandler({
      handle: defaultHandler,
    });

    return this;
  }

  private setupJsLoggerHandler() {
    Log.setHandler((messages: any[], context: any) => {
      this.handlers.forEach(h => h.handle(messages, context));
    });

    return this;
  }

  @Lazy()
  private get logLevelMap() {
    return new Map<LogLevel, ILogLevel>([
      [LogLevel.TRACE, Log.TRACE],
      [LogLevel.DEBUG, Log.DEBUG],
      [LogLevel.INFO, Log.INFO],
      [LogLevel.WARN, Log.WARN],
      [LogLevel.ERROR, Log.ERROR],
      [LogLevel.OFF, Log.OFF],
    ]);
  }
}
