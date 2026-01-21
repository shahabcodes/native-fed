import { Route } from '@angular/router';
import { authGuard, publicGuard, safeLoadRemoteModule } from '@mfe-workspace/shared-services';
import { LayoutComponent } from './layout/layout.component';

export const appRoutes: Route[] = [
  // Public routes (login)
  {
    path: 'login',
    canActivate: [publicGuard],
    loadChildren: safeLoadRemoteModule('login', './routes')
  },

  // Protected routes with layout
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: safeLoadRemoteModule('dashboard', './routes')
      },
      {
        path: 'inspection',
        loadChildren: safeLoadRemoteModule('inspection', './routes')
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
