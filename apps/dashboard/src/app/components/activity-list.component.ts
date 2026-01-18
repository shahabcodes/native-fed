import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecentActivity } from '../services/dashboard-api.service';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="activity-list">
      <div class="activity-item" *ngFor="let activity of activities">
        <div class="activity-icon" [class]="'icon-' + activity.type">
          <span [innerHTML]="getIcon(activity.type)"></span>
        </div>
        <div class="activity-content">
          <div class="activity-title">{{ activity.title }}</div>
          <div class="activity-desc">{{ activity.description }}</div>
        </div>
        <div class="activity-meta">{{ activity.user }}</div>
      </div>
    </div>
  `,
  styles: [`
    .activity-list { display: flex; flex-direction: column; gap: 1rem; }
    .activity-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid #f3f4f6; }
    .activity-item:last-child { border-bottom: none; }
    .activity-icon {
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
    }
    .icon-completed { background: #dcfce7; color: #16a34a; }
    .icon-created { background: #dbeafe; color: #2563eb; }
    .icon-updated { background: #fef3c7; color: #d97706; }
    .activity-content { flex: 1; }
    .activity-title { font-weight: 500; color: #1f2937; }
    .activity-desc { font-size: 0.875rem; color: #6b7280; }
    .activity-meta { font-size: 0.75rem; color: #9ca3af; }
  `]
})
export class ActivityListComponent {
  @Input() activities: RecentActivity[] = [];

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      completed: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
      created: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
      updated: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>'
    };
    return icons[type] || '';
  }
}
