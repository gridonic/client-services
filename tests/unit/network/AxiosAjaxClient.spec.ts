import axios from 'axios';
import AxiosAjaxClient from '@/network/AxiosAjaxClient';
import { AjaxClient } from '../../../src/network/AjaxClient';

import Mock = jest.Mock;
jest.mock('axios');

class TestContext {
  public client!: AjaxClient;

  before() {
    jest.clearAllMocks();
    this.client = new AxiosAjaxClient();
  }

  public get axiosGetMock(): Mock {
    return axios.get as Mock;
  }

  public get axiosPostMock(): Mock {
    return axios.post as Mock;
  }

  public get axiosPutMock(): Mock {
    return axios.put as Mock;
  }

  public get axiosDeleteMock(): Mock {
    return axios.delete as Mock;
  }

  public get axiosRequestMock(): Mock {
    return axios.request as Mock;
  }
}

const ctx = new TestContext();

describe('Axios Ajax Service Client', () => {
  beforeEach(() => {
    ctx.before();
  });

  describe('get request', () => {
    test('axios get called with correct parameters', () => {
      ctx.client.get('https://gridonic.ch', {
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

  describe('post request', () => {
    test('axios post called with correct parameters', () => {
      ctx.client.post('https://gridonic.ch', { payload: 'somePayload' }, {
        responseType: 'json',
        timeout: 30,
      });

      expect(ctx.axiosPostMock.mock.calls.length).toBe(1);

      expect(ctx.axiosPostMock.mock.calls[0][0]).toEqual('https://gridonic.ch');
      expect(ctx.axiosPostMock.mock.calls[0][1]).toEqual({
        payload: 'somePayload',
      });

      expect(ctx.axiosPostMock.mock.calls[0][2]).toEqual({
        responseType: 'json',
        timeout: 30,
      });
    });
  });

  describe('put request', () => {
    test('axios put called with correct parameters', () => {
      ctx.client.put('https://gridonic.ch', { payload: 'somePayload' }, {
        responseType: 'json',
        timeout: 30,
      });

      expect(ctx.axiosPutMock.mock.calls.length).toBe(1);

      expect(ctx.axiosPutMock.mock.calls[0][0]).toEqual('https://gridonic.ch');
      expect(ctx.axiosPutMock.mock.calls[0][1]).toEqual({
        payload: 'somePayload',
      });

      expect(ctx.axiosPutMock.mock.calls[0][2]).toEqual({
        responseType: 'json',
        timeout: 30,
      });
    });
  });

  describe('delete request', () => {
    test('axios delete called with correct parameters', () => {
      ctx.client.delete('https://gridonic.ch', {
        responseType: 'json',
        timeout: 30,
      });

      expect(ctx.axiosDeleteMock.mock.calls.length).toBe(1);

      expect(ctx.axiosDeleteMock.mock.calls[0][0]).toEqual('https://gridonic.ch');

      expect(ctx.axiosDeleteMock.mock.calls[0][1]).toEqual({
        responseType: 'json',
        timeout: 30,
      });
    });
  });

  describe('general request', () => {
    test('axios general request called with correct parameters', () => {
      ctx.client.request({
        url: 'https://gridonic.ch',
        method: 'GET',
        responseType: 'json',
        timeout: 30,
      });

      expect(ctx.axiosRequestMock.mock.calls.length).toBe(1);

      expect(ctx.axiosRequestMock.mock.calls[0][0]).toEqual({
        url: 'https://gridonic.ch',
        method: 'GET',
        responseType: 'json',
        timeout: 30,
      });
    });
  });
});
