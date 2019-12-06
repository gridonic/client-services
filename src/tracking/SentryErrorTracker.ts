import { VueConstructor } from 'vue';

import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

import { ErrorTracker } from './ErrorTracker';
import { Logger } from '../core/Logger';

export interface SentryErrorTrackerConfig {
  id: string,
  environment: string,
  vue?: VueConstructor
}

/**
 * TODO: documentation
 */
export default class SentryErrorTracker implements ErrorTracker {
  private log: Logger;

  constructor(log: Logger) {
    this.log = log;
  }

  public init(config: SentryErrorTrackerConfig) {
    if (!config.environment) {
      throw new Error('environment must not be empty');
    }

    if (!config.id) {
      this.log.warn('No dsn provided, Sentry is disabled');
      return;
    }

    this.log.info('Sentry enabled');

    const sentryParams: Sentry.BrowserOptions = {
      dsn: config.id,
      environment: config.environment,
    };

    if (config.vue) {
      this.log.info('Vue integration enabled for Sentry');

      sentryParams.integrations = [
        new Integrations.Vue({ Vue: config.vue, attachProps: true, logErrors: true }),
      ];
    }

    Sentry.init(sentryParams);
  }
}
