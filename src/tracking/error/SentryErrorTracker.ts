import { VueConstructor } from 'vue';

import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

import { ErrorTracker } from './ErrorTracker';
import { Logger } from '../../core/logging/Logger';

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

  private config: SentryErrorTrackerConfig;

  constructor(log: Logger, config: SentryErrorTrackerConfig) {
    this.log = log;
    this.config = config;

    this.log.createChannel('sentry');
  }

  public start() {
    if (!this.config.environment) {
      throw new Error('environment must not be empty');
    }

    if (!this.config.id) {
      this.log.channel.sentry.debug('No dsn provided, Sentry is disabled');
      return;
    }

    this.log.channel.sentry.debug('Sentry enabled');

    const sentryParams: Sentry.BrowserOptions = {
      dsn: this.config.id,
      environment: this.config.environment,
    };

    if (this.config.vue) {
      this.log.channel.sentry.debug('Vue integration enabled for Sentry');

      sentryParams.integrations = [
        new Integrations.Vue({ Vue: this.config.vue, attachProps: true, logErrors: true }),
      ];
    }

    Sentry.init(sentryParams);
  }
}
