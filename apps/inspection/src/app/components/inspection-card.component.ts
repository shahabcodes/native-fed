import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Inspection } from '@mfe-workspace/shared-services';

@Component({
  selector: 'app-inspection-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inspection-card" (click)="cardClick.emit(inspection)">
      <div class="card-header">
        <span class="card-id">{{ inspection.id }}</span>
        <span class="status-badge" [class]="'status-' + inspection.status">{{ inspection.status | titlecase }}</span>
      </div>
      <h3 class="card-title">{{ inspection.title }}</h3>
      <p class="card-location">📍 {{ inspection.location }}</p>
      <div class="card-footer">
        <span class="inspector">👤 {{ inspection.inspectorName }}</span>
        <span class="priority-badge" [class]="'priority-' + inspection.priority">{{ inspection.priority }}</span>
      </div>
    </div>
  `,
  styles: [`
    .inspection-card {
      background: white; border-radius: 12px; padding: 1.25rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08); cursor: pointer;
      transition: all 200ms;
    }
    .inspection-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.12); transform: translateY(-2px); }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; gap: 0.5rem; }
    .card-id { font-size: 0.75rem; color: #6b7280; font-weight: 500; }
    .status-badge { font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 9999px; font-weight: 500; white-space: nowrap; }
    .status-pending { background: #fef3c7; color: #d97706; }
    .status-in_progress { background: #dbeafe; color: #2563eb; }
    .status-completed { background: #dcfce7; color: #16a34a; }
    .card-title { font-size: 1rem; font-weight: 600; color: #1f2937; margin: 0 0 0.5rem 0; }
    .card-location { font-size: 0.875rem; color: #6b7280; margin: 0 0 1rem 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
    .inspector { font-size: 0.875rem; color: #4b5563; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .priority-badge { font-size: 0.75rem; padding: 0.125rem 0.5rem; border-radius: 4px; text-transform: uppercase; font-weight: 600; flex-shrink: 0; }
    .priority-low { background: #f3f4f6; color: #6b7280; }
    .priority-medium { background: #fef3c7; color: #d97706; }
    .priority-high { background: #fee2e2; color: #dc2626; }
    .priority-critical { background: #dc2626; color: white; }

    @media (max-width: 576px) {
      .inspection-card { padding: 1rem; }
      .card-title { font-size: 0.9375rem; }
      .card-location { font-size: 0.8125rem; margin-bottom: 0.75rem; }
      .inspector { font-size: 0.8125rem; }
    }
  `]
})
export class InspectionCardComponent {
  @Input() inspection!: Inspection;
  @Output() cardClick = new EventEmitter<Inspection>();
}
