import { ComponentInfo, ComponentRelay } from './ComponentRelay';
import { Logger } from '../core/logging/Logger';

export default class VueRelay implements ComponentRelay {
  private log: Logger;
  private readonly Vue: any;

  constructor(log: Logger, vue: any) {
    this.log = log;
    this.Vue = vue;

    this.log.createChannel('vue');
  }

  public parse(componentInfo: ComponentInfo): any {
    const { selector } = componentInfo;

    const $els = [...document.querySelectorAll(selector)] as HTMLElement[];

    return $els.map(($el: HTMLElement) => {
      this.log.channel.vue.info(`Creating component for <${selector}>`);

      if (componentInfo.before) {
        componentInfo.before();
      }

      return this.createComponent($el, componentInfo.component, componentInfo.args);
    });
  }

  private createComponent($el: HTMLElement, component: any, args?: { [key: string]: any }) {
    let componentArgs = {
      el: $el,

      // @see https://vuejs.org/v2/guide/render-function.html#createElement-Arguments
      render: (createElement: any) => createElement(
        component,
        {
          class: $el.className,
          ...(JSON.parse(($el as HTMLElement).dataset.component || '{}')),
        },
        $el.innerHTML,
      ),
    };

    componentArgs = Object.assign({}, componentArgs, args || {});

    return new this.Vue(componentArgs);
  }
}
