import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container" [class.loading-overlay]="overlay">
      <div class="spinner" [class]="'spinner-' + size"></div>
      <p class="loading-text" *ngIf="text">{{ text }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      gap: 1rem;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.9);
      z-index: 1000;
    }

    .spinner {
      border: 3px solid #e5e7eb;
      border-top-color: #3f51b5;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .spinner-sm {
      width: 20px;
      height: 20px;
      border-width: 2px;
    }

    .spinner-md {
      width: 32px;
      height: 32px;
    }

    .spinner-lg {
      width: 48px;
      height: 48px;
      border-width: 4px;
    }

    .loading-text {
      color: #6b7280;
      font-size: 0.9375rem;
      margin: 0;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoadingComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() text?: string;
  @Input() overlay = false;
}
