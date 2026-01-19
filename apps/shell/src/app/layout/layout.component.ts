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
    @media (max-width: 768px) { .main-content, .main-content.rtl { margin-left: 0; margin-right: 0; } }
  `]
})
export class LayoutComponent {
  private authService = inject(AuthService);
  private i18nService = inject(I18nService);

  sidebarCollapsed = signal(false);
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
      label: 'Inspections',
      labelAr: 'التفتيشات',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>',
      route: '/inspection',
      badge: 3
    }
  ];

  userName = this.authService.getUserFullName.bind(this.authService);

  toggleSidebar(): void {
    this.sidebarCollapsed.update(collapsed => !collapsed);
  }

  onLogout(): void {
    this.authService.logout();
  }

  onLanguageToggle(): void {
    this.i18nService.toggleLanguage();
  }
}
