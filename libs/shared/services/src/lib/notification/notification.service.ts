import { Injectable, signal, computed } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration: number;
  dismissible: boolean;
  createdAt: Date;
}

export interface NotificationOptions {
  title?: string;
  duration?: number;
  dismissible?: boolean;
}

const DEFAULT_DURATION: Record<NotificationType, number> = {
  success: 3000,
  info: 4000,
  warning: 5000,
  error: 6000
};

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _notifications = signal<Notification[]>([]);

  readonly notifications = this._notifications.asReadonly();
  readonly hasNotifications = computed(() => this._notifications().length > 0);
  readonly notificationCount = computed(() => this._notifications().length);

  private generateId(): string {
    return `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private addNotification(
    type: NotificationType,
    message: string,
    options: NotificationOptions = {}
  ): string {
    const id = this.generateId();
    const notification: Notification = {
      id,
      type,
      title: options.title,
      message,
      duration: options.duration ?? DEFAULT_DURATION[type],
      dismissible: options.dismissible ?? true,
      createdAt: new Date()
    };

    this._notifications.update(notifications => [...notifications, notification]);

    if (notification.duration > 0) {
      setTimeout(() => this.dismiss(id), notification.duration);
    }

    return id;
  }

  success(message: string, options?: NotificationOptions): string {
    return this.addNotification('success', message, options);
  }

  error(message: string, options?: NotificationOptions): string {
    return this.addNotification('error', message, options);
  }

  warning(message: string, options?: NotificationOptions): string {
    return this.addNotification('warning', message, options);
  }

  info(message: string, options?: NotificationOptions): string {
    return this.addNotification('info', message, options);
  }

  dismiss(id: string): void {
    this._notifications.update(notifications =>
      notifications.filter(n => n.id !== id)
    );
  }

  dismissAll(): void {
    this._notifications.set([]);
  }

  dismissByType(type: NotificationType): void {
    this._notifications.update(notifications =>
      notifications.filter(n => n.type !== type)
    );
  }
}
