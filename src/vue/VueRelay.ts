import { VueConstructor } from 'vue';

import { ComponentRelay } from './ComponentRelay';
import { Logger } from '../core/logging/Logger';

export default class VueRelay implements ComponentRelay {
  private log: Logger;
  private readonly Vue: VueConstructor;

  constructor(log: Logger, vueConstructor: VueConstructor) {
    this.log = log;
    this.Vue = vueConstructor;

    this.log.createChannel('vue');
  }

  public parse(tag: string, component: any): any {
    const $els = [...document.querySelectorAll(tag)];

    return $els.map(($el) => {
      this.log.channel.vue.info(`Creating component for <${tag}>`);

      return new this.Vue({
        el: $el,

        // @see https://vuejs.org/v2/guide/render-function.html#createElement-Arguments
        render: createElement => createElement(
          component,
          {
            class: $el.className,
            ...(JSON.parse(($el as HTMLElement).dataset.component || '{}')),
          },
          $el.innerHTML,
        ),
      });
    });
  }
}
