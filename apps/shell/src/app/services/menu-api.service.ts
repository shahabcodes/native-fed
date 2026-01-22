import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { MenuItem } from '@mfe-workspace/shared-ui';
import { MOCK_MENU_ITEMS, MOCK_DELAYS } from '@mfe-workspace/shared-mocks';

@Injectable({ providedIn: 'root' })
export class MenuApiService {
  getMenuItems(): Observable<MenuItem[]> {
    return of(MOCK_MENU_ITEMS).pipe(delay(MOCK_DELAYS.MEDIUM));
  }
}
