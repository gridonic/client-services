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

const CHANNEL = 'SENTRY';

/**
 * TODO: documentation
 */
export default class SentryErrorTracker implements ErrorTracker {
  private log: Logger;

  private config: SentryErrorTrackerConfig;

  constructor(log: Logger, config: SentryErrorTrackerConfig) {
    this.log = log;
    this.config = config;
  }

  public start() {
    if (!this.config.environment) {
      throw new Error('environment must not be empty');
    }

    if (!this.config.id) {
      this.log.cwarn(CHANNEL, 'No dsn provided, Sentry is disabled');
      return;
    }

    this.log.cinfo(CHANNEL, 'Sentry enabled');

    const sentryParams: Sentry.BrowserOptions = {
      dsn: this.config.id,
      environment: this.config.environment,
    };

    if (this.config.vue) {
      this.log.cinfo(CHANNEL, 'Vue integration enabled for Sentry');

      sentryParams.integrations = [
        new Integrations.Vue({ Vue: this.config.vue, attachProps: true, logErrors: true }),
      ];
    }

    Sentry.init(sentryParams);
  }
}
