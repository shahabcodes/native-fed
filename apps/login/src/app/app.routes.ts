import { Route } from '@angular/router';
import { LOGIN_ROUTES } from './login.routes';

export const appRoutes: Route[] = [
  ...LOGIN_ROUTES,
  { path: '**', redirectTo: '' }
];
