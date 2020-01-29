import { createLocalVue } from '@vue/test-utils';

import Vue, { CreateElement } from 'vue';
import Vuex from 'vuex';

import JsLogger from '@/core/logging/JsLogger';
import { LogLevel } from '@/core/logging/LogLevel';

import VueRelay from '@/vue/VueRelay';

const localVue = createLocalVue();
localVue.use(Vuex);

class TestContext {
  public relay: VueRelay;
  public vueComponent: Vue;

  public component: Vue|null = null;

  constructor() {
    this.relay = new VueRelay(new JsLogger(LogLevel.OFF), localVue);
    this.vueComponent = this.createVueComponent();
  }

  public before() {
    this.component = null;
  }

  parseDefault() {
    this.relay.parse({
      selector: 'test-component',
      component: this.vueComponent,
    });
  }

  private createVueComponent(): any {
    const self = this;

    return localVue.component('text-display', {
      props: {
        msg: {
          type: String,
          default: '',
        },
      },
      mounted() {
        self.component = this;
      },
      render(h: CreateElement) {
        return h('div', this.msg);
      },
    });
  }
}

const ctx = new TestContext();

describe('VueRelay', () => {
  beforeEach(() => {
    ctx.before();
  });

  describe('given no component hook in DOM', () => {
    test('then no vue component is mounted', () => {
      ctx.parseDefault();

      expect(ctx.component).toBeFalsy();
    });
  });

  describe('given component hook with no data for test component in DOM', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div><test-component /></div>';
    });

    test('then test component is mounted', () => {
      ctx.parseDefault();

      expect(ctx.component).toBeTruthy();
    });

    test('then no data is passed to the component', () => {
      ctx.parseDefault();

      expect(ctx.component!.$props.msg).toEqual('');
    });

    describe('shared store', () => {
      test('given no store argument, then store is not available in component', () => {
        ctx.parseDefault();

        expect(ctx.component!.$store).toBeFalsy();
      });

      test('given store argument is passed, then the store is available in the component', () => {
        ctx.relay.parse({
          selector: 'test-component',
          component: ctx.vueComponent,
          args: {
            store: new Vuex.Store({
              state: {
                message: 'Hello!',
              },
            }),
          },
        });

        expect(ctx.component!.$store).toBeTruthy();
      });
    });

    describe('hooks', () => {
      test('"before" hook is not called when no component mounted', () => {
        let beforeWasCalled = false;

        ctx.relay.parse({
          selector: 'not-found-component',
          component: ctx.vueComponent,
          before: () => {
            beforeWasCalled = true;
          },
        });

        expect(beforeWasCalled).toBe(false);
      });

      test('"before" hook is called before component is mounted', () => {
        let beforeWasCalled = false;
        let componentNotMountedAtBefore = false;

        ctx.relay.parse({
          selector: 'test-component',
          component: ctx.vueComponent,
          before: () => {
            beforeWasCalled = true;
            componentNotMountedAtBefore = !ctx.component;
          },
        });

        expect(beforeWasCalled).toBe(true);
        expect(componentNotMountedAtBefore).toBe(true);
      });
    });
  });

  describe('given component hook with class selector', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div><div class="test-component"></div></div>';
    });

    test('when parsed with a non-existing class, then no component is mounted', () => {
      ctx.relay.parse({
        selector: '.not-existing-element',
        component: ctx.vueComponent,
      });

      expect(ctx.component).toBeFalsy();
    });

    test('when parsed with existing class, then component is mounted', () => {
      ctx.relay.parse({
        selector: '.test-component',
        component: ctx.vueComponent,
      });

      expect(ctx.component).toBeTruthy();
    });
  });

  describe('given component hook with json encoded data for test component in DOM', () => {
    test('then data is available in component', () => {
      document.body.innerHTML = '<div>'
        + '<test-component data-component=\'{ "props": { "msg": "Hello component" } }\' />'
        + '</div>';

      ctx.parseDefault();

      expect(ctx.component!.$props.msg).toEqual('Hello component');
    });
  });

  describe('TODO: multiple', () => {
    // TODO: multiple setups
  });
});
