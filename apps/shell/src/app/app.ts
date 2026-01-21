import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { I18nService } from '@mfe-workspace/shared-i18n';
import { NotificationContainerComponent } from '@mfe-workspace/shared-ui';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationContainerComponent],
  selector: 'app-root',
  template: `
    <div class="app-container" [attr.dir]="direction()">
      <router-outlet></router-outlet>
      <lib-notification-container />
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }
  `]
})
export class App {
  private i18nService = inject(I18nService);

  direction = this.i18nService.direction;

  constructor() {
    // Initialize direction on app start
    effect(() => {
      document.documentElement.dir = this.direction();
      document.body.dir = this.direction();
    });
  }
}
