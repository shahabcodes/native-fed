import { ErrorHandler, Injectable, inject, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '../logger/logger.service';
import { NotificationService } from '../notification/notification.service';
import { ConfigService } from '../config/config.service';
import {
  AppError,
  AppException,
  ErrorCategory,
  ErrorSeverity,
  createAppError
} from '../models/error.model';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private logger = inject(LoggerService);
  private notificationService = inject(NotificationService);
  private configService = inject(ConfigService);
  private ngZone = inject(NgZone);

  handleError(error: unknown): void {
    const appError = this.normalizeError(error);

    this.logger.logAppError(appError, 'GlobalErrorHandler');

    this.ngZone.run(() => {
      this.showUserNotification(appError);
    });

    if (this.configService.isDevelopment()) {
      console.error('Original error:', error);
    }
  }

  private normalizeError(error: unknown): AppError {
    if (error instanceof AppException) {
      return error.toAppError();
    }

    if (error instanceof HttpErrorResponse) {
      return this.normalizeHttpError(error);
    }

    if (error instanceof Error) {
      return this.normalizeJsError(error);
    }

    return createAppError({
      code: 'UNKNOWN_ERROR',
      message: String(error),
      userMessage: 'An unexpected error occurred. Please try again.',
      severity: 'error',
      category: 'system',
      originalError: error
    });
  }

  private normalizeHttpError(error: HttpErrorResponse): AppError {
    const statusMessages: Record<number, { message: string; userMessage: string; category: ErrorCategory }> = {
      0: {
        message: 'Network error - no response received',
        userMessage: 'Unable to connect to the server. Please check your internet connection.',
        category: 'network'
      },
      400: {
        message: 'Bad request',
        userMessage: 'The request was invalid. Please check your input.',
        category: 'validation'
      },
      401: {
        message: 'Unauthorized',
        userMessage: 'Your session has expired. Please log in again.',
        category: 'auth'
      },
      403: {
        message: 'Forbidden',
        userMessage: 'You do not have permission to perform this action.',
        category: 'auth'
      },
      404: {
        message: 'Not found',
        userMessage: 'The requested resource was not found.',
        category: 'business'
      },
      408: {
        message: 'Request timeout',
        userMessage: 'The request timed out. Please try again.',
        category: 'network'
      },
      429: {
        message: 'Too many requests',
        userMessage: 'Too many requests. Please wait a moment and try again.',
        category: 'business'
      },
      500: {
        message: 'Internal server error',
        userMessage: 'A server error occurred. Please try again later.',
        category: 'system'
      },
      502: {
        message: 'Bad gateway',
        userMessage: 'The server is temporarily unavailable. Please try again later.',
        category: 'system'
      },
      503: {
        message: 'Service unavailable',
        userMessage: 'The service is temporarily unavailable. Please try again later.',
        category: 'system'
      },
      504: {
        message: 'Gateway timeout',
        userMessage: 'The server took too long to respond. Please try again.',
        category: 'network'
      }
    };

    const statusInfo = statusMessages[error.status] || {
      message: `HTTP error ${error.status}`,
      userMessage: 'An error occurred while communicating with the server.',
      category: 'system' as ErrorCategory
    };

    const serverMessage = error.error?.message || error.message;

    return createAppError({
      code: `HTTP_${error.status}`,
      message: `${statusInfo.message}: ${serverMessage}`,
      userMessage: statusInfo.userMessage,
      severity: error.status >= 500 ? 'critical' : 'error',
      category: statusInfo.category,
      originalError: error,
      context: {
        status: error.status,
        statusText: error.statusText,
        url: error.url
      }
    });
  }

  private normalizeJsError(error: Error): AppError {
    let category: ErrorCategory = 'system';
    let userMessage = 'An unexpected error occurred. Please try again.';

    if (error.message.includes('ChunkLoadError') || error.message.includes('Loading chunk')) {
      category = 'remote_module';
      userMessage = 'Failed to load a part of the application. Please refresh the page.';
    } else if (error.message.includes('TypeError')) {
      category = 'system';
      userMessage = 'A technical error occurred. Please refresh the page.';
    }

    return createAppError({
      code: error.name || 'JS_ERROR',
      message: error.message,
      userMessage,
      severity: 'error',
      category,
      originalError: error,
      context: {
        stack: error.stack
      }
    });
  }

  private showUserNotification(appError: AppError): void {
    if (!this.configService.getFeature('enableNotifications')) {
      return;
    }

    if (appError.severity === 'info') {
      return;
    }

    const notificationMap: Record<ErrorSeverity, 'info' | 'warning' | 'error'> = {
      info: 'info',
      warning: 'warning',
      error: 'error',
      critical: 'error'
    };

    const type = notificationMap[appError.severity];
    this.notificationService[type](appError.userMessage);
  }
}
