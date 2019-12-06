import Log from 'js-logger';
import { ILogLevel } from 'js-logger/src/types.d';
import { Logger, LoggerHandler } from './Logger';
import { LogLevel } from './LogLevel';
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
  private static CHANNEL_DEFAULT = 'DEFAULT';

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

  ctrace(channel: string, ...messages: any[]): void {
    this.logger(channel).trace(messages);
  }

  cdebug(channel: string, ...messages: any[]): void {
    this.logger(channel).debug(messages);
  }

  cinfo(channel: string, ...messages: any[]) {
    this.logger(channel).info(messages);
  }

  cwarn(channel: string, ...messages: any[]): void {
    this.logger(channel).warn(messages);
  }

  cerror(channel: string, ...messages: any[]): void {
    this.logger(channel).error(messages);
  }

  public trace(...messages: any[]): void {
    this.ctrace(JsLogger.CHANNEL_DEFAULT, ...messages);
  }

  public info(...messages: any[]): void {
    this.cinfo(JsLogger.CHANNEL_DEFAULT, ...messages);
  }

  public debug(...messages: any[]): void {
    this.cdebug(JsLogger.CHANNEL_DEFAULT, ...messages);
  }

  public warn(...messages: any[]): void {
    this.cwarn(JsLogger.CHANNEL_DEFAULT, ...messages);
  }

  public error(...messages: any[]): void {
    this.cerror(JsLogger.CHANNEL_DEFAULT, ...messages);
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

  private logger(channel: string) {
    return Log.get(channel);
  }
}
