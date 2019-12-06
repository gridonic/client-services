export interface Logger {
  trace(...x: any[]): void;
  debug(...x: any[]): void;
  info(...x: any[]): void;
  warn(...x: any[]): void;
  error(...x: any[]): void;
}

export interface LoggerHandler {
  handle(messages: any[], context: any): void;
}

// eslint-disable-next-line import/prefer-default-export
export enum LogLevel {
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  OFF,
}
