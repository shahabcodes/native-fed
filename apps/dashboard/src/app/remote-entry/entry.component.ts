import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent, LoadingComponent } from '@mfe-workspace/shared-ui';
import { TranslatePipe } from '@mfe-workspace/shared-i18n';
import { DashboardApiService, DashboardStats, RecentActivity } from '../services/dashboard-api.service';
import { StatsCardComponent } from '../components/stats-card.component';
import { ActivityListComponent } from '../components/activity-list.component';

@Component({
  selector: 'app-dashboard-entry',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, LoadingComponent, StatsCardComponent, ActivityListComponent, TranslatePipe],
  template: `
    <div class="dashboard">
      <header class="page-header">
        <h1 class="page-title">{{ 'dashboard.title' | translate }}</h1>
        <p class="page-subtitle">{{ 'dashboard.subtitle' | translate }}</p>
      </header>

      <section class="stats-grid" *ngIf="stats(); else statsLoading">
        <app-stats-card [value]="stats()!.totalInspections" [label]="'dashboard.totalInspections' | translate" [icon]="icons.clipboard" color="#3f51b5"></app-stats-card>
        <app-stats-card [value]="stats()!.pendingReview" [label]="'dashboard.pendingReview' | translate" [icon]="icons.clock" color="#f59e0b"></app-stats-card>
        <app-stats-card [value]="stats()!.completedToday" [label]="'dashboard.completedToday' | translate" [icon]="icons.check" color="#10b981"></app-stats-card>
        <app-stats-card [value]="stats()!.activeInspectors" [label]="'Active Inspectors'" [icon]="icons.users" color="#8b5cf6"></app-stats-card>
      </section>

      <ng-template #statsLoading>
        <section class="stats-grid">
          <div class="skeleton-card" *ngFor="let i of [1,2,3,4]"></div>
        </section>
      </ng-template>

      <div class="content-grid">
        <lib-card [title]="'dashboard.recentActivity' | translate">
          <div card-actions>
            <a routerLink="/inspection" class="view-all-link">{{ 'dashboard.viewAll' | translate }} →</a>
          </div>
          <app-activity-list *ngIf="activities(); else activityLoading" [activities]="activities()!"></app-activity-list>
          <ng-template #activityLoading><lib-loading text="Loading..."></lib-loading></ng-template>
        </lib-card>

        <lib-card [title]="'dashboard.quickActions' | translate">
          <div class="quick-actions">
            <a routerLink="/inspection" class="action-btn action-primary">
              <span class="action-icon" [innerHTML]="icons.plus"></span>
              <span>{{ 'inspection.newInspection' | translate }}</span>
            </a>
            <a routerLink="/inspection" class="action-btn action-secondary">
              <span class="action-icon" [innerHTML]="icons.list"></span>
              <span>{{ 'dashboard.viewAll' | translate }}</span>
            </a>
          </div>
        </lib-card>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 2rem; }
    .page-title { font-size: 1.75rem; font-weight: 700; color: var(--text-primary, #1f2937); margin: 0 0 0.5rem 0; }
    .page-subtitle { color: var(--text-tertiary, #6b7280); margin: 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
    .skeleton-card { height: 100px; background: linear-gradient(90deg, var(--card-border, #e5e7eb) 25%, var(--demo-bg, #f3f4f6) 50%, var(--card-border, #e5e7eb) 75%); background-size: 200% 100%; animation: skeleton 1.5s infinite; border-radius: 12px; }
    @keyframes skeleton { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    .content-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
    .view-all-link { color: var(--link-color, #3f51b5); text-decoration: none; font-size: 0.875rem; font-weight: 500; }
    .view-all-link:hover { color: var(--link-hover, #002984); }
    .quick-actions { display: flex; flex-direction: column; gap: 1rem; }
    .action-btn { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border-radius: 10px; text-decoration: none; transition: all 150ms; min-height: 44px; }
    .action-primary { background-color: var(--btn-primary-bg, #3f51b5); color: var(--btn-primary-text, white); }
    .action-primary:hover { background-color: var(--btn-primary-bg-hover, #002984); }
    .action-secondary { background-color: var(--demo-bg, #f3f4f6); color: var(--text-secondary, #374151); }
    .action-secondary:hover { background-color: var(--card-border, #e5e7eb); }
    .action-icon { display: flex; }

    @media (max-width: 1024px) {
      .content-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 768px) {
      .page-header { margin-bottom: 1.5rem; }
      .page-title { font-size: 1.5rem; }
      .stats-grid { gap: 1rem; margin-bottom: 1.5rem; }
      .content-grid { gap: 1rem; }
    }

    @media (max-width: 576px) {
      .stats-grid { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
      .page-title { font-size: 1.25rem; }
      .page-subtitle { font-size: 0.875rem; }
    }
  `]
})
export class RemoteEntryComponent implements OnInit {
  private dashboardApi = inject(DashboardApiService);

  stats = signal<DashboardStats | null>(null);
  activities = signal<RecentActivity[] | null>(null);

  icons = {
    clipboard: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>',
    clock: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    check: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
    users: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    plus: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
    list: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>'
  };

  ngOnInit(): void {
    this.dashboardApi.getStats().subscribe(data => this.stats.set(data));
    this.dashboardApi.getRecentActivity().subscribe(data => this.activities.set(data));
  }
}
