import { Injectable, inject } from '@angular/core';
import { ConfigService, LogLevel } from '../config/config.service';
import { AppError } from '../models/error.model';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  correlationId?: string;
  context?: string;
  data?: unknown;
  error?: Error | AppError;
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  none: 4
};

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private configService = inject(ConfigService);
  private currentCorrelationId: string | null = null;

  setCorrelationId(id: string): void {
    this.currentCorrelationId = id;
  }

  clearCorrelationId(): void {
    this.currentCorrelationId = null;
  }

  getCorrelationId(): string | null {
    return this.currentCorrelationId;
  }

  generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  debug(message: string, data?: unknown, context?: string): void {
    this.log('debug', message, data, context);
  }

  info(message: string, data?: unknown, context?: string): void {
    this.log('info', message, data, context);
  }

  warn(message: string, data?: unknown, context?: string): void {
    this.log('warn', message, data, context);
  }

  error(message: string, error?: Error | AppError | unknown, context?: string): void {
    this.log('error', message, undefined, context, error as Error | AppError);
  }

  private log(
    level: LogLevel,
    message: string,
    data?: unknown,
    context?: string,
    error?: Error | AppError
  ): void {
    const configLevel = this.configService.logLevel();

    if (!this.shouldLog(level, configLevel)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      correlationId: this.currentCorrelationId || undefined,
      context,
      data,
      error
    };

    this.writeToConsole(entry);
  }

  private shouldLog(level: LogLevel, configLevel: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[configLevel];
  }

  private writeToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const prefix = entry.correlationId
      ? `[${timestamp}] [${entry.correlationId}]`
      : `[${timestamp}]`;
    const contextPrefix = entry.context ? `[${entry.context}]` : '';
    const fullPrefix = `${prefix}${contextPrefix}`;

    const args: unknown[] = [`${fullPrefix} ${entry.message}`];

    if (entry.data !== undefined) {
      args.push(entry.data);
    }

    if (entry.error) {
      args.push(entry.error);
    }

    switch (entry.level) {
      case 'debug':
        console.debug(...args);
        break;
      case 'info':
        console.info(...args);
        break;
      case 'warn':
        console.warn(...args);
        break;
      case 'error':
        console.error(...args);
        break;
    }
  }

  logAppError(appError: AppError, context?: string): void {
    const logContext = context || appError.category;

    switch (appError.severity) {
      case 'info':
        this.info(appError.message, appError.context, logContext);
        break;
      case 'warning':
        this.warn(appError.message, appError.context, logContext);
        break;
      case 'error':
      case 'critical':
        this.error(appError.message, appError, logContext);
        break;
    }
  }
}
