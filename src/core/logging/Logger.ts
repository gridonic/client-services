export interface LogChannel {
  trace(...x: any[]): void;
  debug(...x: any[]): void;
  info(...x: any[]): void;
  warn(...x: any[]): void;
  error(...x: any[]): void;
}

export interface Logger extends LogChannel {
  channel: { [key: string]: LogChannel };

  createChannel(name: string): void;
}

export interface LoggerHandler {
  handle(messages: any[], context: any): void;
}
