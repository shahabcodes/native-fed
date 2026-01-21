import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'lib-remote-load-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-container">
      <div class="error-content">
        <div class="error-icon">!</div>
        <h1 class="error-title">Failed to Load Module</h1>
        <p class="error-message">
          We couldn't load the <strong>{{ remoteName }}</strong> module.
          This might be due to a network issue or the service being temporarily unavailable.
        </p>
        <div class="error-details" *ngIf="errorMessage">
          <code>{{ errorMessage }}</code>
        </div>
        <div class="error-actions">
          <button class="btn btn-primary" (click)="retry()">
            Try Again
          </button>
          <button class="btn btn-secondary" (click)="goToDashboard()">
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
      padding: 2rem;
    }

    .error-content {
      text-align: center;
      max-width: 500px;
    }

    .error-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      border-radius: 50%;
      background: var(--notification-error-bg, #fef2f2);
      border: 3px solid var(--notification-error-border, #ef4444);
      color: var(--notification-error-icon, #ef4444);
      font-size: 2.5rem;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .error-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary, #1f2937);
      margin: 0 0 1rem 0;
    }

    .error-message {
      color: var(--text-secondary, #4b5563);
      line-height: 1.6;
      margin: 0 0 1.5rem 0;
    }

    .error-message strong {
      color: var(--text-primary, #1f2937);
    }

    .error-details {
      background: var(--card-bg, #f9fafb);
      border: 1px solid var(--card-border, #e5e7eb);
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      overflow-x: auto;
    }

    .error-details code {
      font-size: 0.875rem;
      color: var(--text-tertiary, #6b7280);
      word-break: break-all;
    }

    .error-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 150ms;
      border: none;
    }

    .btn-primary {
      background: var(--btn-primary-bg, #3f51b5);
      color: var(--btn-primary-text, white);
    }

    .btn-primary:hover {
      background: var(--btn-primary-hover, #303f9f);
    }

    .btn-secondary {
      background: var(--card-bg, white);
      color: var(--text-secondary, #4b5563);
      border: 1px solid var(--card-border, #e5e7eb);
    }

    .btn-secondary:hover {
      background: var(--card-hover, #f9fafb);
    }

    @media (max-width: 480px) {
      .error-container {
        padding: 1rem;
      }

      .error-icon {
        width: 60px;
        height: 60px;
        font-size: 2rem;
      }

      .error-title {
        font-size: 1.25rem;
      }

      .error-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class RemoteLoadErrorComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  remoteName: string = 'Unknown';
  errorMessage: string | null = null;

  constructor() {
    const data = this.route.snapshot.data;
    this.remoteName = data['remoteName'] || 'Unknown';
    this.errorMessage = data['error'] || null;
  }

  retry(): void {
    window.location.reload();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
