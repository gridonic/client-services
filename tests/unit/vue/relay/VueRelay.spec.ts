import Vue, { CreateElement } from 'vue';
import VueRelay from '@/vue/VueRelay';

class TestContext {
  public relay: VueRelay;
  public vueComponent: Vue;

  public componentMounted = false;
  public componentPropValues: any = {};

  constructor() {
    this.relay = new VueRelay(Vue);
    this.vueComponent = this.createVueComponent();
  }

  public before() {
    this.componentMounted = false;
    this.componentPropValues = {};
  }

  private createVueComponent(): any {
    const self = this;

    return Vue.component('text-display', {
      props: {
        msg: {
          type: String,
          default: '',
        },
      },
      mounted() {
        self.componentMounted = true;
        self.componentPropValues = this.$props;
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
      ctx.relay.parse('test-component', ctx.vueComponent);

      expect(ctx.componentMounted).toBe(false);
    });
  });

  describe('given component hook with no data for test component in DOM', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div><test-component /></div>';
    });

    test('then test component is mounted', () => {
      ctx.relay.parse('test-component', ctx.vueComponent);

      expect(ctx.componentMounted).toBe(true);
    });

    test('then no data is passed to the component', () => {
      ctx.relay.parse('test-component', ctx.vueComponent);

      expect(ctx.componentPropValues.msg).toEqual('');
    });
  });

  describe('given component hook with json encoded data for test component in DOM', () => {
    test('then data is available in component', () => {
      document.body.innerHTML = '<div>'
        + '<test-component data-component=\'{ "props": { "msg": "Hello component" } }\' />'
        + '</div>';


      ctx.relay.parse('test-component', ctx.vueComponent);

      expect(ctx.componentPropValues.msg).toEqual('Hello component');
    });
  });

  describe('TODO: multiple', () => {
    // TODO: multiple setups
    // TODO: query or element
    // TODO: even bus
  });
});
