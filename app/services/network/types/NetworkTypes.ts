import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { z } from "zod";

export interface NetworkError {
  message: string;
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  useCache?: boolean;
  cacheKey?: string;
  cacheTTL?: number; // seconds
  retries?: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Generic API endpoint configuration
export interface ApiEndpoint<TRequest = unknown, TResponse = unknown> {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  requestSchema?: z.ZodSchema<TRequest>;
  responseSchema: z.ZodSchema<TResponse>;
  config?: RequestConfig;
}

// Network service interface following ISP
export interface INetworkService {
  request<TRequest, TResponse>(
    endpoint: ApiEndpoint<TRequest, TResponse>,
    data?: TRequest,
    config?: RequestConfig
  ): Promise<TResponse>;

  get<TResponse>(
    endpoint: ApiEndpoint<never, TResponse>,
    config?: RequestConfig
  ): Promise<TResponse>;

  post<TRequest, TResponse>(
    endpoint: ApiEndpoint<TRequest, TResponse>,
    data: TRequest,
    config?: RequestConfig
  ): Promise<TResponse>;

  put<TRequest, TResponse>(
    endpoint: ApiEndpoint<TRequest, TResponse>,
    data: TRequest,
    config?: RequestConfig
  ): Promise<TResponse>;

  delete<TResponse>(
    endpoint: ApiEndpoint<never, TResponse>,
    config?: RequestConfig
  ): Promise<TResponse>;

  clearCache(): void;
  removeCacheEntry(key: string): void;
  setGlobalErrorHandler(handler: (error: NetworkError) => void): void;
}
