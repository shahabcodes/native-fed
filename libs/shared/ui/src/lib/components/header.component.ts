import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header" [class.rtl]="isRtl">
      <div class="header-start">
        <button class="menu-btn" (click)="menuToggle.emit()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <h1 class="app-name">{{ appName }}</h1>
      </div>

      <div class="header-end">
        <button class="theme-btn" (click)="themeToggle.emit()" [title]="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          <!-- Sun icon for dark mode -->
          <svg *ngIf="isDark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <!-- Moon icon for light mode -->
          <svg *ngIf="!isDark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
        <button class="lang-btn" (click)="languageToggle.emit()" [title]="currentLang === 'en' ? 'Switch to Arabic' : 'Switch to English'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <span class="lang-label">{{ currentLang === 'en' ? 'العربية' : 'EN' }}</span>
        </button>
        <div class="user-info" *ngIf="username">
          <div class="user-avatar">{{ userInitials }}</div>
          <span class="user-name">{{ username }}</span>
        </div>
        <button class="logout-btn" (click)="logout.emit()" title="Logout">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 64px;
      background-color: var(--card-bg, white);
      border-bottom: 1px solid var(--card-border, #e5e7eb);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      z-index: 100;
      transition: background-color 200ms, border-color 200ms;
    }

    .header-start, .header-end {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .menu-btn, .logout-btn, .theme-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      min-width: 44px;
      min-height: 44px;
      border: none;
      background: none;
      border-radius: 8px;
      cursor: pointer;
      color: var(--text-tertiary, #6b7280);
      transition: all 150ms;
    }

    .menu-btn:hover, .logout-btn:hover, .theme-btn:hover {
      background-color: var(--demo-bg, #f3f4f6);
      color: var(--text-primary, #1f2937);
    }

    .app-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary, #1f2937);
      margin: 0;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: var(--btn-primary-bg, #3f51b5);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .user-name {
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--text-secondary, #374151);
    }

    .lang-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--card-border, #e5e7eb);
      background: var(--card-bg, white);
      border-radius: 8px;
      cursor: pointer;
      color: var(--text-secondary, #374151);
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 150ms;
    }

    .lang-btn:hover {
      background-color: var(--demo-bg, #f3f4f6);
      border-color: var(--input-border, #d1d5db);
    }

    .lang-label {
      font-family: inherit;
    }

    /* RTL Support */
    .header.rtl {
      direction: rtl;
    }

    .header.rtl .header-start,
    .header.rtl .header-end {
      flex-direction: row-reverse;
    }

    @media (max-width: 768px) {
      .header {
        padding: 0 1rem;
      }
      .header-start, .header-end {
        gap: 0.5rem;
      }
      .user-name {
        display: none;
      }
      .lang-label {
        display: none;
      }
      .app-name {
        font-size: 1rem;
      }
    }

    @media (max-width: 576px) {
      .header {
        padding: 0 0.75rem;
      }
      .lang-btn {
        padding: 0.5rem;
      }
    }
  `]
})
export class HeaderComponent {
  @Input() appName = 'MFE App';
  @Input() username?: string;
  @Input() currentLang: 'en' | 'ar' = 'en';
  @Input() isRtl = false;
  @Input() isDark = false;

  @Output() menuToggle = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() languageToggle = new EventEmitter<void>();
  @Output() themeToggle = new EventEmitter<void>();

  get userInitials(): string {
    if (!this.username) return '';
    return this.username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
