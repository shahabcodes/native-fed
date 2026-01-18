import { Route } from '@angular/router';
import { RemoteEntryComponent } from './remote-entry/entry.component';
import { InspectionListComponent } from './pages/inspection-list.component';
import { InspectionDetailComponent } from './pages/inspection-detail.component';

export const INSPECTION_ROUTES: Route[] = [
  {
    path: '',
    component: RemoteEntryComponent,
    children: [
      { path: '', component: InspectionListComponent },
      { path: ':id', component: InspectionDetailComponent }
    ]
  }
];
