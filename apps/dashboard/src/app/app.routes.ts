import { Route } from '@angular/router';
import { DASHBOARD_ROUTES } from './dashboard.routes';

export const appRoutes: Route[] = [
  ...DASHBOARD_ROUTES,
  { path: '**', redirectTo: '' }
];
