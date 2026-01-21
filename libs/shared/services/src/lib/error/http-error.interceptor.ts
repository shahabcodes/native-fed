import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import { NotificationService } from '../notification/notification.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const correlationId = logger.getCorrelationId() || logger.generateCorrelationId();

      logger.error(
        `HTTP Error: ${error.status} ${error.statusText} - ${req.url}`,
        error,
        'HttpErrorInterceptor'
      );

      switch (error.status) {
        case 0:
          notificationService.error('Unable to connect to the server. Please check your internet connection.');
          break;

        case 401:
          notificationService.warning('Your session has expired. Please log in again.');
          router.navigate(['/login']);
          break;

        case 403:
          notificationService.error('You do not have permission to perform this action.');
          break;

        case 404:
          logger.warn(`Resource not found: ${req.url}`, undefined, 'HttpErrorInterceptor');
          break;

        case 429:
          notificationService.warning('Too many requests. Please wait a moment and try again.');
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          notificationService.error('A server error occurred. Please try again later.');
          break;

        default:
          if (error.status >= 400 && error.status < 500) {
            const message = error.error?.message || 'The request could not be completed.';
            notificationService.error(message);
          }
          break;
      }

      return throwError(() => error);
    })
  );
};
