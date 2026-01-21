import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification, NotificationType } from '@mfe-workspace/shared-services';

@Component({
  selector: 'lib-notification-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container" role="region" aria-live="polite" aria-label="Notifications">
      @for (notification of notifications(); track notification.id) {
        <div
          class="notification"
          [class]="'notification notification--' + notification.type"
          role="alert"
        >
          <div class="notification__icon">
            <span class="icon">{{ getIcon(notification.type) }}</span>
          </div>
          <div class="notification__content">
            @if (notification.title) {
              <div class="notification__title">{{ notification.title }}</div>
            }
            <div class="notification__message">{{ notification.message }}</div>
          </div>
          @if (notification.dismissible) {
            <button
              class="notification__close"
              (click)="dismiss(notification.id)"
              aria-label="Dismiss notification"
            >
              &times;
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
      width: calc(100% - 2rem);
      pointer-events: none;
    }

    .notification {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      pointer-events: auto;
      animation: slideIn 0.3s ease-out;
      background: var(--notification-bg, white);
      border: 1px solid var(--notification-border, #e5e7eb);
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .notification--success {
      background: var(--notification-success-bg, #ecfdf5);
      border-color: var(--notification-success-border, #10b981);
    }

    .notification--success .notification__icon {
      color: var(--notification-success-icon, #10b981);
    }

    .notification--error {
      background: var(--notification-error-bg, #fef2f2);
      border-color: var(--notification-error-border, #ef4444);
    }

    .notification--error .notification__icon {
      color: var(--notification-error-icon, #ef4444);
    }

    .notification--warning {
      background: var(--notification-warning-bg, #fffbeb);
      border-color: var(--notification-warning-border, #f59e0b);
    }

    .notification--warning .notification__icon {
      color: var(--notification-warning-icon, #f59e0b);
    }

    .notification--info {
      background: var(--notification-info-bg, #eff6ff);
      border-color: var(--notification-info-border, #3b82f6);
    }

    .notification--info .notification__icon {
      color: var(--notification-info-icon, #3b82f6);
    }

    .notification__icon {
      flex-shrink: 0;
      font-size: 1.25rem;
      line-height: 1;
    }

    .notification__content {
      flex: 1;
      min-width: 0;
    }

    .notification__title {
      font-weight: 600;
      font-size: 0.9375rem;
      color: var(--text-primary, #1f2937);
      margin-bottom: 0.25rem;
    }

    .notification__message {
      font-size: 0.875rem;
      color: var(--text-secondary, #4b5563);
      line-height: 1.5;
    }

    .notification__close {
      flex-shrink: 0;
      width: 1.5rem;
      height: 1.5rem;
      border: none;
      background: transparent;
      font-size: 1.25rem;
      line-height: 1;
      color: var(--text-tertiary, #9ca3af);
      cursor: pointer;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 150ms;
    }

    .notification__close:hover {
      background: rgba(0, 0, 0, 0.05);
      color: var(--text-secondary, #4b5563);
    }

    @media (max-width: 480px) {
      .notification-container {
        top: auto;
        bottom: 1rem;
        right: 0.5rem;
        left: 0.5rem;
        width: auto;
        max-width: none;
      }

      @keyframes slideIn {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    }
  `]
})
export class NotificationContainerComponent {
  private notificationService = inject(NotificationService);

  notifications = this.notificationService.notifications;

  getIcon(type: NotificationType): string {
    const icons: Record<NotificationType, string> = {
      success: '\u2713',
      error: '\u2717',
      warning: '\u26A0',
      info: '\u2139'
    };
    return icons[type];
  }

  dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }
}
