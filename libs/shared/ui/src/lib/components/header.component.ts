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
      background-color: white;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      z-index: 100;
    }

    .header-start, .header-end {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .menu-btn, .logout-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: none;
      background: none;
      border-radius: 8px;
      cursor: pointer;
      color: #6b7280;
      transition: all 150ms;
    }

    .menu-btn:hover, .logout-btn:hover {
      background-color: #f3f4f6;
      color: #1f2937;
    }

    .app-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
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
      background-color: #3f51b5;
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
      color: #374151;
    }

    .lang-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      color: #374151;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 150ms;
    }

    .lang-btn:hover {
      background-color: #f3f4f6;
      border-color: #d1d5db;
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
      .user-name {
        display: none;
      }
      .lang-label {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  @Input() appName = 'MFE App';
  @Input() username?: string;
  @Input() currentLang: 'en' | 'ar' = 'en';
  @Input() isRtl = false;

  @Output() menuToggle = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() languageToggle = new EventEmitter<void>();

  get userInitials(): string {
    if (!this.username) return '';
    return this.username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
