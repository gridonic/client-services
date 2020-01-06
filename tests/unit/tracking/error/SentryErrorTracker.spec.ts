import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

import SentryErrorTracker, { SentryErrorTrackerConfig } from '@/tracking/error/SentryErrorTracker';
import JsLogger from '@/core/logging/JsLogger';

import { Logger } from '@/core/logging/Logger';
import { LogLevel } from '@/core/logging/LogLevel';

import Mock = jest.Mock;

jest.mock('@sentry/browser');
jest.mock('@sentry/integrations');

class TestContext {
  private logger!: Logger;

  public tracker!: SentryErrorTracker;

  public before() {
    this.logger = new JsLogger(LogLevel.OFF);

    this.sentryInitMock.mockClear();
    this.vueIntegrationMock.mockClear();
  }

  public initTracker(config: SentryErrorTrackerConfig) {
    this.tracker = new SentryErrorTracker(this.logger, config);
    this.tracker.start();
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

  test('given empty environment, throws exception', () => {
    expect(() => ctx.initTracker({ id: 'fake-sentry-id', environment: '' }))
      .toThrowError('Environment must not be empty');
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

  test('given project name but no version, then no release is set', () => {
    ctx.initTracker({ id: 'fake-sentry-id', environment: 'prod', projectName: 'my-project' });

    expect(ctx.sentryInitMock.mock.calls[0][0].release).toBeFalsy();
  });

  test('given version but no project name, then no release is set', () => {
    ctx.initTracker({ id: 'fake-sentry-id', environment: 'prod', version: '0.1.0' });

    expect(ctx.sentryInitMock.mock.calls[0][0].release).toBeFalsy();
  });

  test('given version and project name, then no release is set', () => {
    ctx.initTracker({
      id: 'fake-sentry-id',
      environment: 'prod',
      projectName: 'my-project',
      version: '0.1.0',
    });

    expect(ctx.sentryInitMock.mock.calls[0][0].release).toEqual('my-project@0.1.0');
  });
});
