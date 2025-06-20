import axios, { type AxiosInstance, type AxiosError } from "axios";
import { supabase } from "@services/auth/supabase";
import type {
  NetworkError,
  RequestConfig,
  CacheEntry,
  ApiEndpoint,
  INetworkService,
} from "./types/NetworkTypes";

export class NetworkService implements INetworkService {
  private client: AxiosInstance;
  private cache = new Map<string, CacheEntry<unknown>>();
  private onGlobalError?: (error: NetworkError) => void;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for auth
    this.client.interceptors.request.use(
      async config => {
        const skipAuth = (config as RequestConfig).skipAuth;

        if (!skipAuth) {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
          }
        }

        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor for global error handling
    this.client.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        const networkError = this.transformError(error);

        // Trigger global error handler
        if (this.onGlobalError) {
          this.onGlobalError(networkError);
        }

        return Promise.reject(networkError);
      }
    );
  }

  setGlobalErrorHandler(handler: (error: NetworkError) => void) {
    this.onGlobalError = handler;
  }

  private transformError(error: AxiosError): NetworkError {
    if (error.response) {
      // Server responded with error status
      const data = error.response.data as any;
      return {
        message: data?.message || error.message,
        statusCode: error.response.status,
        code: error.code,
        details: error.response.data,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: "Network error - no response received",
        code: error.code,
      };
    } else {
      // Something else happened
      return {
        message: error.message,
        code: error.code,
      };
    }
  }

  private async getFromCache<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl * 1000) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private setCache<T>(key: string, data: T, ttl: number) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  async request<TRequest, TResponse>(
    endpoint: ApiEndpoint<TRequest, TResponse>,
    data?: TRequest,
    config?: RequestConfig
  ): Promise<TResponse> {
    const { url, method, requestSchema, responseSchema } = endpoint;
    const mergedConfig = { ...endpoint.config, ...config };

    // Validate request data if schema provided
    if (requestSchema && data) {
      const validation = requestSchema.safeParse(data);
      if (!validation.success) {
        throw new Error(`Invalid request data: ${validation.error.message}`);
      }
    }

    // Check cache for GET requests
    if (method === "GET" && mergedConfig.useCache) {
      const cacheKey =
        mergedConfig.cacheKey || `${method}:${url}:${JSON.stringify(data)}`;
      const cached = await this.getFromCache<TResponse>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Make request with retry logic
    let lastError: NetworkError;
    const maxRetries = mergedConfig.retries || 0;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.client.request({
          url,
          method,
          data,
          ...mergedConfig,
        });

        // Validate response
        const validation = responseSchema.safeParse(response.data);
        if (!validation.success) {
          throw new Error(`Invalid response data: ${validation.error.message}`);
        }

        const validatedData = validation.data;

        // Cache successful GET responses
        if (method === "GET" && mergedConfig.useCache) {
          const cacheKey =
            mergedConfig.cacheKey || `${method}:${url}:${JSON.stringify(data)}`;
          const ttl = mergedConfig.cacheTTL || 300; // 5 minutes default
          this.setCache(cacheKey, validatedData, ttl);
        }

        return validatedData;
      } catch (error) {
        lastError = error as NetworkError;

        // Don't retry on certain status codes
        if (
          lastError.statusCode &&
          [401, 403, 404, 422].includes(lastError.statusCode)
        ) {
          break;
        }

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          await new Promise(resolve =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }
      }
    }

    throw lastError!;
  }

  // Convenience methods
  async get<TResponse>(
    endpoint: ApiEndpoint<never, TResponse>,
    config?: RequestConfig
  ): Promise<TResponse> {
    return this.request({ ...endpoint, method: "GET" }, undefined, config);
  }

  async post<TRequest, TResponse>(
    endpoint: ApiEndpoint<TRequest, TResponse>,
    data: TRequest,
    config?: RequestConfig
  ): Promise<TResponse> {
    return this.request({ ...endpoint, method: "POST" }, data, config);
  }

  async put<TRequest, TResponse>(
    endpoint: ApiEndpoint<TRequest, TResponse>,
    data: TRequest,
    config?: RequestConfig
  ): Promise<TResponse> {
    return this.request({ ...endpoint, method: "PUT" }, data, config);
  }

  async delete<TResponse>(
    endpoint: ApiEndpoint<never, TResponse>,
    config?: RequestConfig
  ): Promise<TResponse> {
    return this.request({ ...endpoint, method: "DELETE" }, undefined, config);
  }

  // Cache management
  clearCache() {
    this.cache.clear();
  }

  removeCacheEntry(key: string) {
    this.cache.delete(key);
  }
}
