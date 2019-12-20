import Log from 'js-logger';

import { LogLevel } from '@/core/logging/LogLevel';
import JsLogger from '@/core/logging/JsLogger';
import JsLogChannel from '@/core/logging/JsLogChannel';

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

      expect(ctx.channels).toEqual(['default', 'default', 'default', 'default', 'default']);
    });

    test('given new channel is created, then this channel is returned.', () => {
      expect(ctx.logger.createChannel('custom'))
        .toBeInstanceOf(JsLogChannel);
    });

    test('given specific channel, then this channel is used', () => {
      ctx.logger.createChannel('custom');

      ctx.logger.channel.custom.trace('custom');
      ctx.logger.channel.custom.debug('custom');
      ctx.logger.channel.custom.info('custom');
      ctx.logger.channel.custom.warn('custom');
      ctx.logger.channel.custom.error('custom');

      expect(ctx.channels).toEqual(['custom', 'custom', 'custom', 'custom', 'custom']);
    });

    test('mixed channels', () => {
      ctx.logger.createChannel('first');
      ctx.logger.createChannel('third');

      ctx.logger.channel.first.trace('a trace');
      ctx.logger.info('something custom');
      ctx.logger.channel.third.warn('something to warn');
      ctx.logger.channel.first.error('ohoh, this failed!');

      expect(ctx.channels).toEqual(['first', 'default', 'third', 'first']);
    });
  });
});
