import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  ErrorHandler
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appRoutes } from './app.routes';
import {
  GlobalErrorHandler,
  authInterceptor,
  httpErrorInterceptor
} from '@mfe-workspace/shared-services';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, httpErrorInterceptor])
    ),
    provideAnimations(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
};
