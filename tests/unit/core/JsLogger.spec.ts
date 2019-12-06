import Log from 'js-logger';

import { LogLevel } from '@/core/LogLevel';
import JsLogger from '@/core/JsLogger';

import Mock = jest.Mock;

class TestContext {
  public logger!: JsLogger;

  public defaultOutput!: string[];

  public customOutput!: string[];

  public channels!: string[];

  public before(logLevel: LogLevel) {
    this.defaultOutput = [];
    this.customOutput = [];
    this.channels = [];

    this.defaultHandlerMock.mockClear();

    this.logger = new JsLogger(logLevel);

    this.logger.addHandler({
      handle: (messages: any[], context: any) => {
        this.customOutput.push(messages[0][0]);
      },
    });
  }

  public get defaultHandlerMock(): Mock {
    Log.createDefaultHandler = jest.fn().mockReturnValue((messages: any[], context: any) => {
      this.channels.push(context.name);
      this.defaultOutput.push(messages[0][0]);
    });

    return Log.createDefaultHandler as Mock;
  }
}

const ctx = new TestContext();

describe('JsLogger', () => {
  describe('given logger disabled', () => {
    beforeEach(() => {
      ctx.before(LogLevel.OFF);
    });

    test('logger does not write to default handler', () => {
      ctx.logger.info('log info');

      expect(ctx.defaultOutput).toEqual([]);
    });

    test('logger does not write to customly added handler', () => {
      ctx.logger.info('log info');

      expect(ctx.customOutput).toEqual([]);
    });
  });

  describe('given logger enabled', () => {
    beforeEach(() => {
      ctx.before(LogLevel.TRACE);
    });

    test('logger writes to default handler', () => {
      ctx.logger.info('log info');

      expect(ctx.defaultOutput).toEqual(['log info']);
    });

    test('logger writes to customly added handler', () => {
      ctx.logger.info('log info');

      expect(ctx.customOutput).toEqual(['log info']);
    });
  });

  describe('log levels', () => {
    test.each([
      [LogLevel.OFF, 0],
      [LogLevel.TRACE, 5],
      [LogLevel.DEBUG, 4],
      [LogLevel.INFO, 3],
      [LogLevel.WARN, 2],
      [LogLevel.ERROR, 1],
      // [LogLevel.DEBUG, 2],
    ])('level(%i)', (logLevel: any, expectedWriteCount: any) => {
      ctx.before(logLevel);

      ctx.logger.trace('log info');
      ctx.logger.debug('log info');
      ctx.logger.info('log info');
      ctx.logger.warn('log warn');
      ctx.logger.error('log error');

      expect(ctx.customOutput.length).toBe(expectedWriteCount);
    });
  });

  describe('log channels', () => {
    beforeEach(() => {
      ctx.before(LogLevel.TRACE);
    });

    test('given no channel, then default is used', () => {
      ctx.logger.trace('default');
      ctx.logger.debug('default');
      ctx.logger.info('default');
      ctx.logger.warn('default');
      ctx.logger.error('default');

      expect(ctx.channels).toEqual(['DEFAULT', 'DEFAULT', 'DEFAULT', 'DEFAULT', 'DEFAULT']);
    });

    test('given specific channel, then this channel is used', () => {
      ctx.logger.ctrace('CUSTOM', 'custom');
      ctx.logger.cdebug('CUSTOM', 'custom');
      ctx.logger.cinfo('CUSTOM', 'custom');
      ctx.logger.cwarn('CUSTOM', 'custom');
      ctx.logger.cerror('CUSTOM', 'custom');

      expect(ctx.channels).toEqual(['CUSTOM', 'CUSTOM', 'CUSTOM', 'CUSTOM', 'CUSTOM']);
    });

    test('mixed channels', () => {
      ctx.logger.ctrace('FIRST', 'a trace');
      ctx.logger.info('something custom');
      ctx.logger.cwarn('THIRD', 'something to warn');
      ctx.logger.cerror('FIRST', 'ohoh, this failed!');

      expect(ctx.channels).toEqual(['FIRST', 'DEFAULT', 'THIRD', 'FIRST']);
    });
  });
});
