import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Inspection } from '@mfe-workspace/shared-services';
import { MOCK_INSPECTIONS, MOCK_DELAYS } from '@mfe-workspace/shared-mocks';

@Injectable({ providedIn: 'root' })
export class InspectionApiService {
  getInspections(): Observable<Inspection[]> {
    return of(MOCK_INSPECTIONS).pipe(delay(MOCK_DELAYS.MEDIUM));
  }

  getInspectionById(id: string): Observable<Inspection | undefined> {
    return of(MOCK_INSPECTIONS.find(i => i.id === id)).pipe(delay(MOCK_DELAYS.SHORT));
  }
}
