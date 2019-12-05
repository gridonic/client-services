import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

import SentryErrorTracker, { SentryErrorTrackerConfig } from '@/tracking/SentryErrorTracker';

import Mock = jest.Mock;

jest.mock('@sentry/browser');
jest.mock('@sentry/integrations');

class LocalTestHelper {
  public tracker!: SentryErrorTracker;

  public before() {
    this.tracker = new SentryErrorTracker();

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

const helper = new LocalTestHelper();

describe('SentryErrorTracker', () => {
  beforeEach(() => {
    helper.before();
  });

  describe('senty tracker initialization', () => {
    test('given empty environment, throws exception', () => {
      expect(() => helper.initTracker({ id: 'fake-sentry-id', environment: '' }))
        .toThrowError('environment must not be empty');
    });

    test('given tracker id and environment, then sentry setup method called with correct values', () => {
      helper.initTracker({ id: 'fake-sentry-id', environment: 'prod' });

      expect(helper.sentryInitMock.mock.calls.length).toBe(1);

      expect(helper.sentryInitMock.mock.calls[0][0]).toEqual({
        dsn: 'fake-sentry-id',
        environment: 'prod',
      });
    });

    test('given vue parameter, then vue integration is added correctly', () => {
      helper.initTracker({
        id: 'fake-sentry-id',
        environment: 'prod',
        vue: Vue,
      });

      const sentryParams: Sentry.BrowserOptions = helper.sentryInitMock.mock.calls[0][0];

      expect(sentryParams.integrations!.length).toBe(1);

      expect(helper.vueIntegrationMock.mock.calls.length).toBe(1);
      expect(helper.vueIntegrationMock.mock.calls[0][0].Vue).toBe(Vue);
    });

    test('given empty tracker id, sentry is not initialized', () => {
      helper.initTracker({
        id: '',
        environment: 'prod',
      });

      expect(helper.sentryInitMock.mock.calls.length).toBe(0);
    });
  });
});
