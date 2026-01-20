import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent, SidebarComponent, MenuItem } from '@mfe-workspace/shared-ui';
import { AuthService } from '@mfe-workspace/shared-services';
import { I18nService } from '@mfe-workspace/shared-i18n';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
  template: `
    <div class="layout" [class.rtl]="isRtl()">
      <lib-header
        [appName]="'MFE Workspace'"
        [username]="userName()"
        [currentLang]="currentLang()"
        [isRtl]="isRtl()"
        (menuToggle)="toggleSidebar()"
        (logout)="onLogout()"
        (languageToggle)="onLanguageToggle()"
      ></lib-header>

      <!-- Mobile overlay backdrop -->
      <div
        class="sidebar-overlay"
        *ngIf="isMobileView() && !sidebarCollapsed()"
        (click)="closeSidebar()"
      ></div>

      <lib-sidebar
        [menuItems]="menuItems"
        [collapsed]="sidebarCollapsed()"
        [currentLang]="currentLang()"
        [isRtl]="isRtl()"
      ></lib-sidebar>

      <main class="main-content" [class.sidebar-collapsed]="sidebarCollapsed()" [class.rtl]="isRtl()">
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout { min-height: 100vh; }
    .layout.rtl { direction: rtl; }
    .main-content {
      margin-left: 260px;
      margin-right: 0;
      margin-top: 64px;
      min-height: calc(100vh - 64px);
      padding: 1.5rem;
      transition: margin 300ms ease-in-out;
      background-color: #f5f5f5;
    }
    .main-content.rtl {
      margin-left: 0;
      margin-right: 260px;
    }
    .main-content.sidebar-collapsed { margin-left: 64px; margin-right: 0; }
    .main-content.sidebar-collapsed.rtl { margin-left: 0; margin-right: 64px; }
    .content-wrapper { max-width: 1400px; margin: 0 auto; }

    .sidebar-overlay {
      position: fixed;
      top: 64px;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 85;
    }

    @media (max-width: 768px) {
      .main-content, .main-content.rtl {
        margin-left: 0;
        margin-right: 0;
        padding: 1rem;
      }
    }

    @media (max-width: 576px) {
      .main-content, .main-content.rtl {
        padding: 0.75rem;
      }
    }
  `]
})
export class LayoutComponent {
  private authService = inject(AuthService);
  private i18nService = inject(I18nService);

  sidebarCollapsed = signal(true);
  isMobileView = signal(false);

  constructor() {
    this.checkMobileView();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.checkMobileView());
    }
  }

  private checkMobileView(): void {
    if (typeof window !== 'undefined') {
      this.isMobileView.set(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        this.sidebarCollapsed.set(false);
      }
    }
  }
  currentLang = this.i18nService.currentLang;
  isRtl = this.i18nService.isRtl;

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      labelAr: 'لوحة التحكم',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
      route: '/dashboard'
    },
    {
      id: 'inspections',
      label: 'Inspections',
      labelAr: 'التفتيشات',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>',
      badge: 3,
      children: [
        {
          label: 'All Inspections',
          labelAr: 'جميع التفتيشات',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
          route: '/inspection'
        },
        {
          label: 'Pending',
          labelAr: 'قيد الانتظار',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
          route: '/inspection/pending',
          badge: 2
        },
        {
          label: 'Completed',
          labelAr: 'مكتملة',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
          route: '/inspection/completed'
        }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      labelAr: 'الإعدادات',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
      children: [
        {
          label: 'Profile',
          labelAr: 'الملف الشخصي',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
          route: '/settings/profile'
        },
        {
          label: 'Notifications',
          labelAr: 'الإشعارات',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>',
          route: '/settings/notifications'
        },
        {
          label: 'Security',
          labelAr: 'الأمان',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
          route: '/settings/security'
        }
      ]
    }
  ];

  userName = this.authService.getUserFullName.bind(this.authService);

  toggleSidebar(): void {
    this.sidebarCollapsed.update(collapsed => !collapsed);
  }

  closeSidebar(): void {
    this.sidebarCollapsed.set(true);
  }

  onLogout(): void {
    this.authService.logout();
  }

  onLanguageToggle(): void {
    this.i18nService.toggleLanguage();
  }
}
