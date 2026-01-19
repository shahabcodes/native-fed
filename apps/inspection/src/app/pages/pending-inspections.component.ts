import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent, LoadingComponent } from '@mfe-workspace/shared-ui';
import { Inspection } from '@mfe-workspace/shared-services';
import { TranslatePipe } from '@mfe-workspace/shared-i18n';
import { InspectionApiService } from '../services/inspection-api.service';
import { InspectionCardComponent } from '../components/inspection-card.component';

@Component({
  selector: 'app-pending-inspections',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ButtonComponent, LoadingComponent, InspectionCardComponent, TranslatePipe],
  template: `
    <div class="inspection-list-page">
      <header class="page-header">
        <div>
          <h1 class="page-title">Pending Inspections</h1>
          <p class="page-subtitle">Inspections waiting to be started</p>
        </div>
        <lib-button variant="primary" (buttonClick)="openNewInspection()">+ {{ 'inspection.newInspection' | translate }}</lib-button>
      </header>

      <div class="filters-bar">
        <input type="text" class="search-input" [placeholder]="'common.search' | translate" [(ngModel)]="searchTerm" (ngModelChange)="onSearch($event)" />
        <div class="filter-tabs">
          <a class="filter-tab" routerLink="/inspection" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">All ({{ totalCount() }})</a>
          <a class="filter-tab" routerLink="/inspection/pending" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Pending ({{ pendingCount() }})</a>
          <a class="filter-tab" routerLink="/inspection/in-progress" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">In Progress ({{ inProgressCount() }})</a>
          <a class="filter-tab" routerLink="/inspection/completed" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Completed ({{ completedCount() }})</a>
        </div>
      </div>

      <div *ngIf="!isLoading(); else loadingState">
        <div class="inspections-grid" *ngIf="filteredInspections().length > 0; else emptyState">
          <app-inspection-card *ngFor="let inspection of filteredInspections()" [inspection]="inspection" (cardClick)="viewInspection($event)"></app-inspection-card>
        </div>
      </div>

      <ng-template #loadingState><lib-loading text="Loading pending inspections..."></lib-loading></ng-template>
      <ng-template #emptyState>
        <div class="empty-state">
          <h3>No pending inspections</h3>
          <p>All inspections have been started or completed</p>
          <lib-button variant="secondary" routerLink="/inspection">View All Inspections</lib-button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
    .page-title { font-size: 1.75rem; font-weight: 700; color: #1f2937; margin: 0 0 0.5rem 0; }
    .page-subtitle { color: #6b7280; margin: 0; }
    .filters-bar { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
    .search-input { max-width: 400px; padding: 0.75rem 1rem; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 0.9375rem; }
    .search-input:focus { outline: none; border-color: #3f51b5; box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1); }
    .filter-tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .filter-tab { padding: 0.5rem 1rem; border: 1px solid #e5e7eb; border-radius: 9999px; background: white; font-size: 0.875rem; font-weight: 500; color: #6b7280; cursor: pointer; transition: all 150ms; text-decoration: none; }
    .filter-tab:hover { border-color: #3f51b5; color: #3f51b5; }
    .filter-tab.active { background: #3f51b5; border-color: #3f51b5; color: white; }
    .inspections-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 4rem 2rem; text-align: center; background: white; border-radius: 12px; }
    .empty-state h3 { font-size: 1.25rem; color: #374151; margin: 0 0 0.5rem 0; }
    .empty-state p { color: #6b7280; margin: 0 0 1.5rem 0; }
  `]
})
export class PendingInspectionsComponent implements OnInit {
  private router = inject(Router);
  private inspectionApi = inject(InspectionApiService);

  allInspections = signal<Inspection[]>([]);
  isLoading = signal(true);
  searchTerm = '';

  filteredInspections = computed(() => {
    let result = this.allInspections().filter(i => i.status === 'pending');
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      result = result.filter(i => i.title.toLowerCase().includes(search) || i.location.toLowerCase().includes(search));
    }
    return result;
  });

  totalCount = computed(() => this.allInspections().length);
  pendingCount = computed(() => this.allInspections().filter(i => i.status === 'pending').length);
  inProgressCount = computed(() => this.allInspections().filter(i => i.status === 'in_progress').length);
  completedCount = computed(() => this.allInspections().filter(i => i.status === 'completed').length);

  ngOnInit(): void {
    this.inspectionApi.getInspections().subscribe({
      next: (data) => { this.allInspections.set(data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false)
    });
  }

  onSearch(term: string): void { this.searchTerm = term; }
  viewInspection(inspection: Inspection): void { this.router.navigate(['/inspection', 'detail', inspection.id]); }
  openNewInspection(): void { alert('New Inspection form would open here'); }
}
