import { Route } from '@angular/router';
import { RemoteEntryComponent } from './remote-entry/entry.component';
import { UnifiedInspectionListComponent } from './pages/unified-inspection-list.component';
import { InspectionDetailComponent } from './pages/inspection-detail.component';

export const INSPECTION_ROUTES: Route[] = [
  {
    path: '',
    component: RemoteEntryComponent,
    children: [
      {
        path: '',
        component: UnifiedInspectionListComponent,
        data: { filterType: 'all' }
      },
      {
        path: 'pending',
        component: UnifiedInspectionListComponent,
        data: { filterType: 'pending' }
      },
      {
        path: 'in-progress',
        component: UnifiedInspectionListComponent,
        data: { filterType: 'in_progress' }
      },
      {
        path: 'completed',
        component: UnifiedInspectionListComponent,
        data: { filterType: 'completed' }
      },
      { path: 'detail/:id', component: InspectionDetailComponent }
    ]
  }
];
