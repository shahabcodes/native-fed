import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface DashboardStats {
  totalInspections: number;
  pendingReview: number;
  completedToday: number;
  activeInspectors: number;
}

export interface RecentActivity {
  id: string;
  type: 'created' | 'updated' | 'completed';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  getStats(): Observable<DashboardStats> {
    return of({
      totalInspections: 156,
      pendingReview: 12,
      completedToday: 8,
      activeInspectors: 24
    }).pipe(delay(500));
  }

  getRecentActivity(): Observable<RecentActivity[]> {
    const activities: RecentActivity[] = [
      { id: '1', type: 'completed', title: 'Safety Inspection #1234', description: 'Completed by John', timestamp: new Date().toISOString(), user: 'John D.' },
      { id: '2', type: 'created', title: 'New Inspection #1235', description: 'Created for Building A', timestamp: new Date().toISOString(), user: 'Admin' },
      { id: '3', type: 'updated', title: 'Inspection #1230', description: 'Status updated', timestamp: new Date().toISOString(), user: 'Sarah M.' },
      { id: '4', type: 'completed', title: 'Fire Safety Check', description: 'All requirements met', timestamp: new Date().toISOString(), user: 'Mike R.' },
    ];
    return of(activities).pipe(delay(700));
  }
}
