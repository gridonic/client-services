import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

import SentryErrorTracker, { SentryErrorTrackerConfig } from '@/tracking/SentryErrorTracker';
import JsLogger from '@/core/JsLogger';

import { LogLevel } from '@/core/Logger';

import Mock = jest.Mock;

jest.mock('@sentry/browser');
jest.mock('@sentry/integrations');

class TestContext {
  public tracker!: SentryErrorTracker;

  public before() {
    this.tracker = new SentryErrorTracker(new JsLogger(LogLevel.OFF));

    this.sentryInitMock.mockClear();
    this.vueIntegrationMock.mockClear();
  }

  public initTracker(config: SentryErrorTrackerConfig) {
    this.tracker.init(config);
  }

  public get sentryInitMock(): Mock {
    return Sentry.init as Mock;
  }

  public get vueIntegrationMock(): Mock {
    // @ts-ignore
    return Integrations.Vue as Mock;
  }
}

const ctx = new TestContext();

describe('SentryErrorTracker', () => {
  beforeEach(() => {
    ctx.before();
  });

  describe('senty tracker initialization', () => {
    test('given empty environment, throws exception', () => {
      expect(() => ctx.initTracker({ id: 'fake-sentry-id', environment: '' }))
        .toThrowError('environment must not be empty');
    });

    test('given tracker id and environment, then sentry setup method called with correct values', () => {
      ctx.initTracker({ id: 'fake-sentry-id', environment: 'prod' });

      expect(ctx.sentryInitMock.mock.calls.length).toBe(1);

      expect(ctx.sentryInitMock.mock.calls[0][0]).toEqual({
        dsn: 'fake-sentry-id',
        environment: 'prod',
      });
    });

    test('given vue parameter, then vue integration is added correctly', () => {
      ctx.initTracker({
        id: 'fake-sentry-id',
        environment: 'prod',
        vue: Vue,
      });

      const sentryParams: Sentry.BrowserOptions = ctx.sentryInitMock.mock.calls[0][0];

      expect(sentryParams.integrations!.length).toBe(1);

      expect(ctx.vueIntegrationMock.mock.calls.length).toBe(1);
      expect(ctx.vueIntegrationMock.mock.calls[0][0].Vue).toBe(Vue);
    });

    test('given empty tracker id, sentry is not initialized', () => {
      ctx.initTracker({
        id: '',
        environment: 'prod',
      });

      expect(ctx.sentryInitMock.mock.calls.length).toBe(0);
    });
  });
});
