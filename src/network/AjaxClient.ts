/**
 * Import axios type definitions and use them for our base interfaces.
 */
import { AxiosRequestConfig, AxiosResponse } from 'axios/index.d';

export interface AjaxClient {
  get(url: string, config: AjaxRequestConfig): Promise<AjaxResponse>;
}

export interface AjaxRequestConfig extends AxiosRequestConfig {
}

export interface AjaxResponse extends AxiosResponse {
}
