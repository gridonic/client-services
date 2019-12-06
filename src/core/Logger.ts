export interface Logger {
  trace(...x: any[]): void;
  debug(...x: any[]): void;
  info(...x: any[]): void;
  warn(...x: any[]): void;
  error(...x: any[]): void;

  ctrace(channel: string, ...messages: any[]): void;
  cdebug(channel: string, ...messages: any[]): void;
  cinfo(channel: string, ...messages: any[]): void;
  cwarn(channel: string, ...messages: any[]): void;
  cerror(channel: string, ...messages: any[]): void;
}

export interface LoggerHandler {
  handle(messages: any[], context: any): void;
}
