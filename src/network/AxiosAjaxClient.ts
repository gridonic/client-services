import axios from 'axios';

import { AjaxClient, AjaxRequestConfig, AjaxResponse } from './AjaxClient';

export default class AxiosAjaxClient implements AjaxClient {
  async get(url: string, config: AjaxRequestConfig): Promise<AjaxResponse> {
    return axios.get(url, config);
  }

  async post(url: string, data: any, config: AjaxRequestConfig): Promise<AjaxResponse> {
    return axios.post(url, data, config);
  }

  async put(url: string, data: any, config: AjaxRequestConfig): Promise<AjaxResponse> {
    return axios.put(url, data, config);
  }

  async delete(url: string, config: AjaxRequestConfig): Promise<AjaxResponse> {
    return axios.delete(url, config);
  }

  async request(config: AjaxRequestConfig): Promise<AjaxResponse> {
    return axios.request(config);
  }
}
