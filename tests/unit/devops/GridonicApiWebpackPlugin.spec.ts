import axios from 'axios';
import GridonicApiWebpackPlugin from '@/devops/GridonicApiWebpackPlugin';

import Mock = jest.Mock;

jest.mock('axios');

class TestContext {
  public plugin!: GridonicApiWebpackPlugin;
  public tapInfo: any;

  before() {
    this.postMock.mockClear();

    this.plugin = new GridonicApiWebpackPlugin(this.pkg);
    this.tapInfo = null;
  }

  apply() {
    this.plugin.apply({});
  }

  public get postPayload() {
    return this.postMock.mock.calls[0][1];
  }

  public get postMock(): Mock {
    return axios.post as Mock;
  }

  private get pkg() {
    return {
      name: 'test-project',
      version: '1.2.5',
      gridonic: {
        apiToken: 'api-token',
        generator: {
          kind: 'vue',
          projectId: '3efc1bfe-c101-4d54-b9b3-3eb110d82510',
          version: '2.0.5',
        },
      },
    };
  }
}

const ctx = new TestContext();

describe('GridonicApiWebpackPlugin', () => {
  beforeEach(() => {
    ctx.before();
  });

  test('contains apply method', () => {
    expect(ctx.plugin.apply).toBeInstanceOf(Function);
  });

  test('when hook is called, then plugin action is run', () => {
    const mock = jest.fn();
    // @ts-ignore
    ctx.plugin.run = mock;
    ctx.apply();

    expect(mock).toBeCalledTimes(1);
  });


  test('when run, makes a post to the api using the authorization key from pkg', () => {
    ctx.apply();

    expect(ctx.postMock).toBeCalledTimes(1);
    expect(ctx.postMock).toBeCalledWith(
      'https://api.gridonic.ch/api/monitoring/build',
      expect.anything(),
      {
        headers: {
          Authorization: 'api-token',
        },
      },
    );
  });

  describe('api post payload. when plugin is run', () => {
    beforeEach(() => {
      ctx.apply();
    });

    test('payload contains project id from pkg info', () => {
      expect(ctx.postPayload.projectId).toEqual('3efc1bfe-c101-4d54-b9b3-3eb110d82510');
    });

    test('payload contains project version from pkg info', () => {
      expect(ctx.postPayload.version).toEqual('1.2.5');
    });

    test('payload contains name from pkg info', () => {
      expect(ctx.postPayload.name).toEqual('test-project');
    });

    test('payload contains kind from pkg generator info', () => {
      expect(ctx.postPayload.kind).toEqual('vue');
    });

    test('payload contains generator version', () => {
      expect(ctx.postPayload.generatorVersion).toEqual('2.0.5');
    });
  });

  describe('error handling', () => {
    test('any errors in plugin are catched', () => {
      const plugin = new GridonicApiWebpackPlugin({});
      expect(() => plugin.apply({})).not.toThrow();
    });
  });
});
