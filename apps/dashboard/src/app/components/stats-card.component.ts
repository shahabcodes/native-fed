import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-card" [style.--accent-color]="color">
      <div class="stats-icon" [innerHTML]="sanitizedIcon"></div>
      <div class="stats-content">
        <div class="stats-value">{{ value }}</div>
        <div class="stats-label">{{ label }}</div>
      </div>
    </div>
  `,
  styles: [`
    .stats-card {
      background: var(--card-bg, white);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 2px 8px var(--card-shadow, rgba(0,0,0,0.08));
      transition: background-color 200ms, box-shadow 200ms;
    }
    .stats-icon {
      width: 48px; height: 48px;
      border-radius: 12px;
      background-color: color-mix(in srgb, var(--accent-color) 15%, var(--card-bg, white));
      color: var(--accent-color);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .stats-value { font-size: 1.75rem; font-weight: 700; color: var(--text-primary, #1f2937); }
    .stats-label { font-size: 0.875rem; color: var(--text-tertiary, #6b7280); }

    @media (max-width: 768px) {
      .stats-card { padding: 1.25rem; }
      .stats-icon { width: 44px; height: 44px; }
      .stats-value { font-size: 1.5rem; }
    }

    @media (max-width: 576px) {
      .stats-card { padding: 1rem; gap: 0.75rem; }
      .stats-icon { width: 40px; height: 40px; border-radius: 8px; }
      .stats-value { font-size: 1.25rem; }
      .stats-label { font-size: 0.75rem; }
    }
  `]
})
export class StatsCardComponent {
  private sanitizer = inject(DomSanitizer);

  @Input() value: number | string = 0;
  @Input() label = '';
  @Input() icon = '';
  @Input() color = '#3f51b5';

  get sanitizedIcon(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.icon);
  }
}
