import { VueConstructor } from 'vue';

import { ComponentRelay } from '@/vue/ComponentRelay';

export default class VueRelay implements ComponentRelay {
  private readonly Vue: VueConstructor;

  constructor(vueConstructor: VueConstructor) {
    this.Vue = vueConstructor;
  }

  public parse(tag: string, component: any): any {
    const $els = [...document.querySelectorAll(tag)];

    return $els.map($el => new this.Vue({
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
    }));
  }
}
