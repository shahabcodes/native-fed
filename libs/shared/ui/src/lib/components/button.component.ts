import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [class]="buttonClasses"
      [disabled]="disabled || loading"
      (click)="onClick($event)"
    >
      <span class="spinner" *ngIf="loading"></span>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      font-size: 0.9375rem;
      font-weight: 500;
      line-height: 1.5;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 150ms ease-in-out;
      min-height: 44px;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: var(--btn-primary-bg, #3f51b5);
      color: var(--btn-primary-text, white);
    }

    .btn-primary:hover:not(:disabled) {
      background-color: var(--btn-primary-bg-hover, #002984);
    }

    .btn-secondary {
      background-color: var(--btn-secondary-bg, transparent);
      color: var(--btn-secondary-text, #3f51b5);
      border: 1px solid var(--btn-secondary-border, #3f51b5);
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: var(--btn-secondary-bg-hover, rgba(63, 81, 181, 0.1));
    }

    .btn-danger {
      background-color: #f44336;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #d32f2f;
    }

    .btn-block {
      display: flex;
      width: 100%;
    }

    .btn-sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
      min-height: 36px;
    }

    .btn-lg {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 576px) {
      button {
        padding: 0.5rem 1rem;
      }
    }
  `]
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() block = false;
  @Input() disabled = false;
  @Input() loading = false;

  @Output() buttonClick = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    const classes = [`btn-${this.variant}`];
    if (this.size !== 'md') classes.push(`btn-${this.size}`);
    if (this.block) classes.push('btn-block');
    return classes.join(' ');
  }

  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }
}
