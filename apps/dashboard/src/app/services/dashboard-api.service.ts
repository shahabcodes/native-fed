import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { DashboardStats, RecentActivity } from '@mfe-workspace/shared-services';
import {
  MOCK_DASHBOARD_STATS,
  MOCK_RECENT_ACTIVITIES,
  MOCK_DELAYS,
} from '@mfe-workspace/shared-mocks';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  getStats(): Observable<DashboardStats> {
    return of(MOCK_DASHBOARD_STATS).pipe(delay(MOCK_DELAYS.MEDIUM));
  }

  getRecentActivity(): Observable<RecentActivity[]> {
    return of(MOCK_RECENT_ACTIVITIES).pipe(delay(MOCK_DELAYS.LONG));
  }
}
