import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { I18nService } from '@mfe-workspace/shared-i18n';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-root',
  template: `<div [attr.dir]="direction()"><router-outlet></router-outlet></div>`,
  styles: [`:host { display: block; }`]
})
export class App {
  private i18nService = inject(I18nService);
  direction = this.i18nService.direction;

  constructor() {
    effect(() => {
      document.documentElement.dir = this.direction();
      document.body.dir = this.direction();
    });
  }
}
