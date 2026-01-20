import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.card-hoverable]="hoverable">
      <div class="card-header" *ngIf="title">
        <h3 class="card-title">{{ title }}</h3>
        <div class="card-actions">
          <ng-content select="[card-actions]"></ng-content>
        </div>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      <div class="card-footer" *ngIf="hasFooter">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background-color: var(--card-bg, white);
      border-radius: 12px;
      box-shadow: 0 2px 8px var(--card-shadow, rgba(0, 0, 0, 0.08));
      padding: 1.5rem;
      transition: box-shadow 200ms ease-in-out, background-color 200ms ease-in-out;
    }

    .card-hoverable:hover {
      box-shadow: 0 4px 16px var(--card-shadow-hover, rgba(0, 0, 0, 0.12));
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--card-border, #e5e7eb);
      gap: 0.75rem;
    }

    .card-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary, #1f2937);
      margin: 0;
    }

    .card-body {
      color: var(--text-secondary, #4b5563);
    }

    .card-footer {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--card-border, #e5e7eb);
    }

    @media (max-width: 768px) {
      .card {
        padding: 1.25rem;
      }
      .card-header {
        margin-bottom: 0.75rem;
        padding-bottom: 0.75rem;
      }
      .card-footer {
        margin-top: 0.75rem;
        padding-top: 0.75rem;
      }
    }

    @media (max-width: 576px) {
      .card {
        padding: 1rem;
      }
      .card-title {
        font-size: 1rem;
      }
    }

    @media (max-width: 400px) {
      .card-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class CardComponent {
  @Input() title?: string;
  @Input() hoverable = false;
  @Input() hasFooter = false;
}
