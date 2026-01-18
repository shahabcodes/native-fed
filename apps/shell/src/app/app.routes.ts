import { Route } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { authGuard, publicGuard } from '@mfe-workspace/shared-services';
import { LayoutComponent } from './layout/layout.component';

export const appRoutes: Route[] = [
  // Public routes (login)
  {
    path: 'login',
    canActivate: [publicGuard],
    loadChildren: () =>
      loadRemoteModule('login', './routes').then((m) => m.LOGIN_ROUTES)
  },

  // Protected routes with layout
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          loadRemoteModule('dashboard', './routes').then((m) => m.DASHBOARD_ROUTES)
      },
      {
        path: 'inspection',
        loadChildren: () =>
          loadRemoteModule('inspection', './routes').then((m) => m.INSPECTION_ROUTES)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Fallback route
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
