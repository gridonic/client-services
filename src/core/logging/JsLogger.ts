import Log from 'js-logger';
import { ILogLevel } from 'js-logger/src/types.d';

import { LogChannel, Logger, LoggerHandler } from './Logger';
import { LogLevel } from './LogLevel';
import JsLogChannel from './JsLogChannel';

import Lazy from '../../decorator/lazy';

/**
 * A logger implementation for usage in the services.
 *
 * By the default, writes to the window console.
 *
 * Implemented using js-logger
 * @see https://github.com/jonnyreeves/js-logger
 */
export default class JsLogger implements Logger {
  private channels: { [key: string]: LogChannel } = {};
  private handlers: LoggerHandler[] = [];

  constructor(logLevel: LogLevel) {
    Log.useDefaults({
      defaultLevel: this.logLevelMap.get(logLevel),
    });

    this.createChannel('default');

    this.createDefaultHandler()
      .setupJsLoggerHandler();
  }

  public get channel(): { [key: string]: LogChannel } {
    return this.channels;
  }

  public addHandler(handler: LoggerHandler) {
    this.handlers.push(handler);
  }

  public createChannel(name: string): LogChannel {
    this.channels[name] = new JsLogChannel(this.logger(name));

    return this.channels[name];
  }

  public trace(...messages: any[]): void {
    this.channel.default.trace(...messages);
  }

  public info(...messages: any[]): void {
    this.channel.default.info(messages);
  }

  public debug(...messages: any[]): void {
    this.channel.default.debug(messages);
  }

  public warn(...messages: any[]): void {
    this.channel.default.warn(messages);
  }

  public error(...messages: any[]): void {
    this.channel.default.error(messages);
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
