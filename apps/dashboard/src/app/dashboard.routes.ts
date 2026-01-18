import { Route } from '@angular/router';
import { RemoteEntryComponent } from './remote-entry/entry.component';

export const DASHBOARD_ROUTES: Route[] = [
  { path: '', component: RemoteEntryComponent }
];
