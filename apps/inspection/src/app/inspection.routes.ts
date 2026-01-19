import { Route } from '@angular/router';
import { RemoteEntryComponent } from './remote-entry/entry.component';
import { AllInspectionsComponent } from './pages/all-inspections.component';
import { PendingInspectionsComponent } from './pages/pending-inspections.component';
import { InProgressInspectionsComponent } from './pages/in-progress-inspections.component';
import { CompletedInspectionsComponent } from './pages/completed-inspections.component';
import { InspectionDetailComponent } from './pages/inspection-detail.component';

export const INSPECTION_ROUTES: Route[] = [
  {
    path: '',
    component: RemoteEntryComponent,
    children: [
      { path: '', component: AllInspectionsComponent },
      { path: 'pending', component: PendingInspectionsComponent },
      { path: 'in-progress', component: InProgressInspectionsComponent },
      { path: 'completed', component: CompletedInspectionsComponent },
      { path: 'detail/:id', component: InspectionDetailComponent }
    ]
  }
];
