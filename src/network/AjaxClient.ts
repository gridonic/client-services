/**
 * Import axios type definitions and use them for our base interfaces.
 */
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios/index.d';

export interface AjaxClient {
  get(url: string, config: AjaxRequestConfig): Promise<AjaxResponse>;
  post(url: string, data: any, config: AjaxRequestConfig): Promise<AjaxResponse>;
  put(url: string, data: any, config: AjaxRequestConfig): Promise<AjaxResponse>;
  delete(url: string, config: AjaxRequestConfig): Promise<AjaxResponse>;

  request(config: AxiosRequestConfig): Promise<AjaxResponse>;
}

export interface AjaxRequestConfig extends AxiosRequestConfig {
}

export interface AjaxResponse extends AxiosResponse {
}

export interface AjaxError extends AxiosError {
}
