import { Injectable, signal, computed } from '@angular/core';

export type Environment = 'development' | 'staging' | 'production';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

export interface FeatureFlags {
  enableAnalytics: boolean;
  enableNotifications: boolean;
  enableOfflineMode: boolean;
  enableDebugMode: boolean;
}

export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

export interface AppConfig {
  apiBaseUrl: string;
  environment: Environment;
  version: string;
  features: FeatureFlags;
  retry: RetryConfig;
  logLevel: LogLevel;
  requestTimeoutMs: number;
}

const DEFAULT_CONFIG: AppConfig = {
  apiBaseUrl: '/api',
  environment: 'development',
  version: '1.0.0',
  features: {
    enableAnalytics: false,
    enableNotifications: true,
    enableOfflineMode: false,
    enableDebugMode: true
  },
  retry: {
    maxRetries: 3,
    initialDelayMs: 1000,
    maxDelayMs: 30000,
    backoffMultiplier: 2
  },
  logLevel: 'debug',
  requestTimeoutMs: 30000
};

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private _config = signal<AppConfig>(DEFAULT_CONFIG);

  readonly config = this._config.asReadonly();

  readonly apiBaseUrl = computed(() => this._config().apiBaseUrl);
  readonly environment = computed(() => this._config().environment);
  readonly version = computed(() => this._config().version);
  readonly features = computed(() => this._config().features);
  readonly retry = computed(() => this._config().retry);
  readonly logLevel = computed(() => this._config().logLevel);
  readonly requestTimeoutMs = computed(() => this._config().requestTimeoutMs);

  readonly isProduction = computed(() => this._config().environment === 'production');
  readonly isDevelopment = computed(() => this._config().environment === 'development');
  readonly isDebugEnabled = computed(() => this._config().features.enableDebugMode);

  initialize(config: Partial<AppConfig>): void {
    this._config.update(current => ({
      ...current,
      ...config,
      features: {
        ...current.features,
        ...(config.features || {})
      },
      retry: {
        ...current.retry,
        ...(config.retry || {})
      }
    }));
  }

  setApiBaseUrl(url: string): void {
    this._config.update(config => ({ ...config, apiBaseUrl: url }));
  }

  setEnvironment(env: Environment): void {
    this._config.update(config => ({ ...config, environment: env }));
  }

  setLogLevel(level: LogLevel): void {
    this._config.update(config => ({ ...config, logLevel: level }));
  }

  setFeature(feature: keyof FeatureFlags, enabled: boolean): void {
    this._config.update(config => ({
      ...config,
      features: {
        ...config.features,
        [feature]: enabled
      }
    }));
  }

  getFeature(feature: keyof FeatureFlags): boolean {
    return this._config().features[feature];
  }

  updateRetryConfig(retry: Partial<RetryConfig>): void {
    this._config.update(config => ({
      ...config,
      retry: {
        ...config.retry,
        ...retry
      }
    }));
  }
}
