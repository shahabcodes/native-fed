import { Route } from '@angular/router';
import { INSPECTION_ROUTES } from './inspection.routes';

export const appRoutes: Route[] = [
  ...INSPECTION_ROUTES,
  { path: '**', redirectTo: '' }
];
