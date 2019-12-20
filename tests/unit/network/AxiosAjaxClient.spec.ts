import axios from 'axios';
import AxiosAjaxClient from '@/network/AxiosAjaxClient';

import Mock = jest.Mock;
jest.mock('axios');

class TestContext {
  before() {
    this.axiosGetMock.mockClear();
  }

  public get axiosGetMock(): Mock {
    return axios.get as Mock;
  }
}

const ctx = new TestContext();

describe('Axios Ajax Service Client', () => {
  describe('get request', () => {
    test('axios called with correct parameters', () => {
      const client = new AxiosAjaxClient();

      client.get('https://gridonic.ch', {
        responseType: 'json',
        timeout: 30,
      });

      expect(ctx.axiosGetMock.mock.calls.length).toBe(1);

      expect(ctx.axiosGetMock.mock.calls[0][0]).toEqual('https://gridonic.ch');
      expect(ctx.axiosGetMock.mock.calls[0][1]).toEqual({
        responseType: 'json',
        timeout: 30,
      });
    });
  });
});
