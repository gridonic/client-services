import axios from 'axios';

import { AjaxClient, AjaxRequestConfig, AjaxResponse } from './AjaxClient';

export default class AxiosAjaxClient implements AjaxClient {
  async get(url: string, config: AjaxRequestConfig): Promise<AjaxResponse> {
    return axios.get(url, config);
  }
}
