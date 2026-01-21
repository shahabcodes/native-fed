import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
import { LoggerService } from '../logger/logger.service';

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  withCredentials?: boolean;
  timeout?: number;
  retryCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private logger = inject(LoggerService);

  private buildUrl(endpoint: string): string {
    const baseUrl = this.configService.apiBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  }

  private buildHeaders(customHeaders?: Record<string, string>): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (customHeaders) {
      Object.entries(customHeaders).forEach(([key, value]) => {
        headers = headers.set(key, value);
      });
    }

    return headers;
  }

  private buildParams(params?: Record<string, string | number | boolean>): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    return httpParams;
  }

  private handleRequest<T>(
    request$: Observable<T>,
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Observable<T> {
    const retryConfig = this.configService.retry();
    const requestTimeout = options.timeout ?? this.configService.requestTimeoutMs();
    const maxRetries = options.retryCount ?? retryConfig.maxRetries;

    return request$.pipe(
      timeout(requestTimeout),
      retry({
        count: maxRetries,
        delay: (error, retryCount) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status >= 400 && error.status < 500 && error.status !== 429) {
              return throwError(() => error);
            }
          }

          const delay = Math.min(
            retryConfig.initialDelayMs * Math.pow(retryConfig.backoffMultiplier, retryCount - 1),
            retryConfig.maxDelayMs
          );

          this.logger.warn(
            `Retrying request to ${endpoint} (attempt ${retryCount}/${maxRetries}) after ${delay}ms`,
            { error: error.message },
            'ApiService'
          );

          return timer(delay);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.logger.error(
          `Request to ${endpoint} failed`,
          error,
          'ApiService'
        );
        return throwError(() => error);
      })
    );
  }

  get<T>(endpoint: string, options: ApiRequestOptions = {}): Observable<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders(options.headers);
    const params = this.buildParams(options.params);

    const request$ = this.http.get<T>(url, {
      headers,
      params,
      withCredentials: options.withCredentials
    });

    return this.handleRequest(request$, endpoint, options);
  }

  post<T>(endpoint: string, body: unknown, options: ApiRequestOptions = {}): Observable<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders(options.headers);
    const params = this.buildParams(options.params);

    const request$ = this.http.post<T>(url, body, {
      headers,
      params,
      withCredentials: options.withCredentials
    });

    return this.handleRequest(request$, endpoint, options);
  }

  put<T>(endpoint: string, body: unknown, options: ApiRequestOptions = {}): Observable<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders(options.headers);
    const params = this.buildParams(options.params);

    const request$ = this.http.put<T>(url, body, {
      headers,
      params,
      withCredentials: options.withCredentials
    });

    return this.handleRequest(request$, endpoint, options);
  }

  patch<T>(endpoint: string, body: unknown, options: ApiRequestOptions = {}): Observable<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders(options.headers);
    const params = this.buildParams(options.params);

    const request$ = this.http.patch<T>(url, body, {
      headers,
      params,
      withCredentials: options.withCredentials
    });

    return this.handleRequest(request$, endpoint, options);
  }

  delete<T>(endpoint: string, options: ApiRequestOptions = {}): Observable<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders(options.headers);
    const params = this.buildParams(options.params);

    const request$ = this.http.delete<T>(url, {
      headers,
      params,
      withCredentials: options.withCredentials
    });

    return this.handleRequest(request$, endpoint, options);
  }
}
