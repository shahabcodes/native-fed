import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardComponent, ButtonComponent, LoadingComponent } from '@mfe-workspace/shared-ui';
import { Inspection } from '@mfe-workspace/shared-services';
import { InspectionApiService } from '../services/inspection-api.service';

@Component({
  selector: 'app-inspection-detail',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, LoadingComponent],
  template: `
    <div class="inspection-detail" *ngIf="inspection(); else loading">
      <header class="page-header">
        <lib-button variant="secondary" (buttonClick)="goBack()">← Back</lib-button>
        <h1 class="page-title">{{ inspection()!.title }}</h1>
      </header>

      <div class="detail-grid">
        <lib-card title="Details">
          <div class="detail-row"><span class="label">ID:</span><span>{{ inspection()!.id }}</span></div>
          <div class="detail-row"><span class="label">Status:</span><span class="status-badge" [class]="'status-' + inspection()!.status">{{ inspection()!.status | titlecase }}</span></div>
          <div class="detail-row"><span class="label">Priority:</span><span class="priority-badge" [class]="'priority-' + inspection()!.priority">{{ inspection()!.priority }}</span></div>
          <div class="detail-row"><span class="label">Location:</span><span>{{ inspection()!.location }}</span></div>
          <div class="detail-row"><span class="label">Inspector:</span><span>{{ inspection()!.inspectorName }}</span></div>
          <div class="detail-row"><span class="label">Scheduled:</span><span>{{ inspection()!.scheduledDate }}</span></div>
          <div class="detail-row" *ngIf="inspection()!.completedDate"><span class="label">Completed:</span><span>{{ inspection()!.completedDate }}</span></div>
        </lib-card>

        <lib-card title="Description">
          <p>{{ inspection()!.description }}</p>
        </lib-card>
      </div>
    </div>

    <ng-template #loading><lib-loading text="Loading inspection..."></lib-loading></ng-template>
  `,
  styles: [`
    .page-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: #1f2937; margin: 0; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    @media (max-width: 768px) { .detail-grid { grid-template-columns: 1fr; } }
    .detail-row { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #f3f4f6; }
    .detail-row:last-child { border-bottom: none; }
    .label { font-weight: 500; color: #6b7280; }
    .status-badge { font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 9999px; font-weight: 500; }
    .status-pending { background: #fef3c7; color: #d97706; }
    .status-in_progress { background: #dbeafe; color: #2563eb; }
    .status-completed { background: #dcfce7; color: #16a34a; }
    .priority-badge { font-size: 0.75rem; padding: 0.125rem 0.5rem; border-radius: 4px; text-transform: uppercase; font-weight: 600; }
    .priority-low { background: #f3f4f6; color: #6b7280; }
    .priority-medium { background: #fef3c7; color: #d97706; }
    .priority-high { background: #fee2e2; color: #dc2626; }
    .priority-critical { background: #dc2626; color: white; }
  `]
})
export class InspectionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private inspectionApi = inject(InspectionApiService);

  inspection = signal<Inspection | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.inspectionApi.getInspectionById(id).subscribe(data => {
        if (data) this.inspection.set(data);
        else this.router.navigate(['/inspection']);
      });
    }
  }

  goBack(): void { this.router.navigate(['/inspection']); }
}
