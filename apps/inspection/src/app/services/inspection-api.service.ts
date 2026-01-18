import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Inspection } from '@mfe-workspace/shared-services';

@Injectable({ providedIn: 'root' })
export class InspectionApiService {
  private mockInspections: Inspection[] = [
    { id: 'INS-001', title: 'Building A Safety Check', description: 'Annual safety inspection', location: 'Building A, Floor 1', status: 'completed', priority: 'high', inspectorId: '1', inspectorName: 'John D.', scheduledDate: '2024-01-15', completedDate: '2024-01-15', createdAt: '2024-01-10', updatedAt: '2024-01-15' },
    { id: 'INS-002', title: 'Fire Safety Audit', description: 'Quarterly fire safety check', location: 'Main Office', status: 'in_progress', priority: 'critical', inspectorId: '2', inspectorName: 'Sarah M.', scheduledDate: '2024-01-18', createdAt: '2024-01-12', updatedAt: '2024-01-18' },
    { id: 'INS-003', title: 'Equipment Maintenance', description: 'Monthly equipment check', location: 'Warehouse B', status: 'pending', priority: 'medium', inspectorId: '1', inspectorName: 'John D.', scheduledDate: '2024-01-20', createdAt: '2024-01-14', updatedAt: '2024-01-14' },
    { id: 'INS-004', title: 'Electrical Systems Review', description: 'Annual electrical inspection', location: 'Building C', status: 'pending', priority: 'high', inspectorId: '3', inspectorName: 'Mike R.', scheduledDate: '2024-01-22', createdAt: '2024-01-15', updatedAt: '2024-01-15' },
    { id: 'INS-005', title: 'HVAC Inspection', description: 'Bi-annual HVAC check', location: 'All Buildings', status: 'completed', priority: 'low', inspectorId: '2', inspectorName: 'Sarah M.', scheduledDate: '2024-01-10', completedDate: '2024-01-10', createdAt: '2024-01-05', updatedAt: '2024-01-10' },
  ];

  getInspections(): Observable<Inspection[]> {
    return of(this.mockInspections).pipe(delay(500));
  }

  getInspectionById(id: string): Observable<Inspection | undefined> {
    return of(this.mockInspections.find(i => i.id === id)).pipe(delay(300));
  }
}
