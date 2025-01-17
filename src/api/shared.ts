import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export type EncooBeeResponseBase = {
  id: string;
  createdAt: string;
  modifiedAt: string;
  createdBy: string;
  modifiedBy: string;
};
export interface HttpClientMiddleware {
  (
    requestConfig: AxiosRequestConfig,
    next: (requestConfig: AxiosRequestConfig) => Promise<AxiosResponse>
  ): Promise<AxiosResponse>;
}

export const createBaseUrlMiddleware = (options: {
  getBaseUrl: () => string;
}): HttpClientMiddleware => {
  return async (config, next) => {
    if (config.baseURL === undefined) {
      config.baseURL = options.getBaseUrl();
    }
    return next(config);
  };
};

export class HttpClient {
  private readonly myAxios: AxiosInstance = axios.create();

  private readonly myMiddlewares: HttpClientMiddleware[] = [];

  use(middleware: HttpClientMiddleware) {
    this.myMiddlewares.push(middleware);
  }

  request<TResponse>(
    requestConfig: AxiosRequestConfig
  ): Promise<AxiosResponse<TResponse>> {
    return this.myGetMiddlewareNext(0)(requestConfig) as Promise<
      AxiosResponse<TResponse>
    >;
  }

  private myGetMiddlewareNext(index: number) {
    const middleware = this.myMiddlewares[index];
    return (requestConfig: AxiosRequestConfig) =>
      middleware
        ? middleware(requestConfig, this.myGetMiddlewareNext(index + 1))
        : this.myAxios.request(requestConfig);
  }
}
