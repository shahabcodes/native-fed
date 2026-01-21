import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ButtonComponent, LoadingComponent } from '@mfe-workspace/shared-ui';
import { Inspection, InspectionStatus, NotificationService } from '@mfe-workspace/shared-services';
import { TranslatePipe } from '@mfe-workspace/shared-i18n';
import { InspectionApiService } from '../services/inspection-api.service';
import { InspectionCardComponent } from '../components/inspection-card.component';

export type InspectionFilterType = 'all' | 'pending' | 'in_progress' | 'completed';

@Component({
  selector: 'app-unified-inspection-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonComponent,
    LoadingComponent,
    InspectionCardComponent,
    TranslatePipe
  ],
  template: `
    <div class="inspection-list-page">
      <header class="page-header">
        <div>
          <h1 class="page-title">{{ pageTitle() | translate }}</h1>
          <p class="page-subtitle">{{ pageSubtitle() | translate }}</p>
        </div>
        <lib-button variant="primary" (buttonClick)="openNewInspection()">
          + {{ 'inspection.newInspection' | translate }}
        </lib-button>
      </header>

      <div class="filters-bar">
        <input
          type="text"
          class="search-input"
          [placeholder]="'common.search' | translate"
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearch($event)"
        />
        <div class="filter-tabs">
          <a
            class="filter-tab"
            routerLink="/inspection"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            {{ 'inspection.filters.all' | translate }} ({{ totalCount() }})
          </a>
          <a
            class="filter-tab"
            routerLink="/inspection/pending"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            {{ 'inspection.filters.pending' | translate }} ({{ pendingCount() }})
          </a>
          <a
            class="filter-tab"
            routerLink="/inspection/in-progress"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            {{ 'inspection.filters.inProgress' | translate }} ({{ inProgressCount() }})
          </a>
          <a
            class="filter-tab"
            routerLink="/inspection/completed"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            {{ 'inspection.filters.completed' | translate }} ({{ completedCount() }})
          </a>
        </div>
      </div>

      @if (!isLoading()) {
        @if (filteredInspections().length > 0) {
          <div class="inspections-grid">
            @for (inspection of filteredInspections(); track inspection.id) {
              <app-inspection-card
                [inspection]="inspection"
                (cardClick)="viewInspection($event)"
              />
            }
          </div>
        } @else {
          <div class="empty-state">
            <h3>{{ emptyStateTitle() | translate }}</h3>
            <p>{{ emptyStateMessage() | translate }}</p>
            @if (filterType() !== 'all') {
              <lib-button variant="secondary" routerLink="/inspection">
                {{ 'inspection.viewAll' | translate }}
              </lib-button>
            } @else {
              <lib-button variant="secondary" (buttonClick)="clearSearch()">
                {{ 'common.clearSearch' | translate }}
              </lib-button>
            }
          </div>
        }
      } @else {
        <lib-loading [text]="'inspection.loading' | translate" />
      }
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary, #1f2937);
      margin: 0 0 0.5rem 0;
    }

    .page-subtitle {
      color: var(--text-tertiary, #6b7280);
      margin: 0;
    }

    .filters-bar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .search-input {
      max-width: 400px;
      padding: 0.75rem 1rem;
      border: 1px solid var(--input-border, #e5e7eb);
      background-color: var(--input-bg, white);
      color: var(--input-text, #374151);
      border-radius: 8px;
      font-size: 0.9375rem;
      min-height: 44px;
      transition: all 150ms;
    }

    .search-input::placeholder {
      color: var(--input-placeholder, #9ca3af);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--input-focus-border, #3f51b5);
      box-shadow: 0 0 0 3px var(--input-focus-shadow, rgba(63, 81, 181, 0.1));
    }

    .filter-tabs {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .filter-tab {
      padding: 0.5rem 1rem;
      border: 1px solid var(--card-border, #e5e7eb);
      border-radius: 9999px;
      background: var(--card-bg, white);
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-tertiary, #6b7280);
      cursor: pointer;
      transition: all 150ms;
      text-decoration: none;
      min-height: 36px;
      display: inline-flex;
      align-items: center;
      white-space: nowrap;
    }

    .filter-tab:hover {
      border-color: var(--btn-primary-bg, #3f51b5);
      color: var(--btn-primary-bg, #3f51b5);
    }

    .filter-tab.active {
      background: var(--btn-primary-bg, #3f51b5);
      border-color: var(--btn-primary-bg, #3f51b5);
      color: var(--btn-primary-text, white);
    }

    .inspections-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.5rem;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4rem 2rem;
      text-align: center;
      background: var(--card-bg, white);
      border-radius: 12px;
    }

    .empty-state h3 {
      font-size: 1.25rem;
      color: var(--text-secondary, #374151);
      margin: 0 0 0.5rem 0;
    }

    .empty-state p {
      color: var(--text-tertiary, #6b7280);
      margin: 0 0 1.5rem 0;
    }

    @media (max-width: 768px) {
      .page-header {
        margin-bottom: 1.5rem;
      }

      .page-title {
        font-size: 1.5rem;
      }

      .filters-bar {
        margin-bottom: 1rem;
      }

      .inspections-grid {
        gap: 1rem;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      }

      .filter-tabs {
        overflow-x: auto;
        flex-wrap: nowrap;
        padding-bottom: 0.5rem;
        -webkit-overflow-scrolling: touch;
      }
    }

    @media (max-width: 576px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;
      }

      .page-title {
        font-size: 1.25rem;
      }

      .page-subtitle {
        font-size: 0.875rem;
      }

      .search-input {
        max-width: 100%;
        width: 100%;
      }

      .inspections-grid {
        grid-template-columns: 1fr;
      }

      .empty-state {
        padding: 2rem 1rem;
      }
    }
  `]
})
export class UnifiedInspectionListComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private inspectionApi = inject(InspectionApiService);
  private notificationService = inject(NotificationService);

  allInspections = signal<Inspection[]>([]);
  isLoading = signal(true);
  searchTerm = '';
  filterType = signal<InspectionFilterType>('all');

  filteredInspections = computed(() => {
    let result = this.allInspections();
    const filter = this.filterType();

    if (filter !== 'all') {
      result = result.filter(i => i.status === filter);
    }

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      result = result.filter(
        i => i.title.toLowerCase().includes(search) || i.location.toLowerCase().includes(search)
      );
    }

    return result;
  });

  totalCount = computed(() => this.allInspections().length);
  pendingCount = computed(() => this.allInspections().filter(i => i.status === 'pending').length);
  inProgressCount = computed(() => this.allInspections().filter(i => i.status === 'in_progress').length);
  completedCount = computed(() => this.allInspections().filter(i => i.status === 'completed').length);

  pageTitle = computed(() => {
    const titles: Record<InspectionFilterType, string> = {
      all: 'inspection.title',
      pending: 'inspection.titles.pending',
      in_progress: 'inspection.titles.inProgress',
      completed: 'inspection.titles.completed'
    };
    return titles[this.filterType()];
  });

  pageSubtitle = computed(() => {
    const subtitles: Record<InspectionFilterType, string> = {
      all: 'inspection.subtitle',
      pending: 'inspection.subtitles.pending',
      in_progress: 'inspection.subtitles.inProgress',
      completed: 'inspection.subtitles.completed'
    };
    return subtitles[this.filterType()];
  });

  emptyStateTitle = computed(() => {
    const titles: Record<InspectionFilterType, string> = {
      all: 'inspection.empty.allTitle',
      pending: 'inspection.empty.pendingTitle',
      in_progress: 'inspection.empty.inProgressTitle',
      completed: 'inspection.empty.completedTitle'
    };
    return titles[this.filterType()];
  });

  emptyStateMessage = computed(() => {
    const messages: Record<InspectionFilterType, string> = {
      all: 'inspection.empty.allMessage',
      pending: 'inspection.empty.pendingMessage',
      in_progress: 'inspection.empty.inProgressMessage',
      completed: 'inspection.empty.completedMessage'
    };
    return messages[this.filterType()];
  });

  ngOnInit(): void {
    const routeData = this.route.snapshot.data;
    if (routeData['filterType']) {
      this.filterType.set(routeData['filterType']);
    }

    this.loadInspections();
  }

  private loadInspections(): void {
    this.inspectionApi.getInspections().subscribe({
      next: (data) => {
        this.allInspections.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.notificationService.error('inspection.errors.loadFailed');
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
  }

  clearSearch(): void {
    this.searchTerm = '';
  }

  viewInspection(inspection: Inspection): void {
    this.router.navigate(['/inspection', 'detail', inspection.id]);
  }

  openNewInspection(): void {
    this.notificationService.info('inspection.newInspectionInfo');
  }
}
