import { VueConstructor } from 'vue';

import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

import { ErrorTracker } from './ErrorTracker';

export interface SentryErrorTrackerConfig {
  id: string,
  environment: string,
  vue?: VueConstructor
}

export default class SentryErrorTracker implements ErrorTracker {
  public init(config: SentryErrorTrackerConfig) {
    if (!config.environment) {
      throw new Error('environment must not be empty');
    }

    if (!config.id) {
      return;
    }

    const sentryParams: Sentry.BrowserOptions = {
      dsn: config.id,
      environment: config.environment,
    };

    if (config.vue) {
      sentryParams.integrations = [
        new Integrations.Vue({ Vue: config.vue, attachProps: true, logErrors: true }),
      ];
    }

    Sentry.init(sentryParams);
  }
}
