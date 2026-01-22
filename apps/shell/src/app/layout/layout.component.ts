import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent, SidebarComponent, MenuItem } from '@mfe-workspace/shared-ui';
import { AuthService, ThemeService } from '@mfe-workspace/shared-services';
import { I18nService } from '@mfe-workspace/shared-i18n';
import { MenuApiService } from '../services/menu-api.service';

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
        [isDark]="isDark()"
        (menuToggle)="toggleSidebar()"
        (logout)="onLogout()"
        (languageToggle)="onLanguageToggle()"
        (themeToggle)="onThemeToggle()"
      ></lib-header>

      <!-- Mobile overlay backdrop -->
      <div
        class="sidebar-overlay"
        *ngIf="isMobileView() && !sidebarCollapsed()"
        (click)="closeSidebar()"
      ></div>

      <lib-sidebar
        [menuItems]="menuItems()"
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
    .layout {
      min-height: 100vh;
      background-color: var(--bg-primary, #f5f5f5);
      transition: background-color 200ms;
    }
    .layout.rtl { direction: rtl; }
    .main-content {
      margin-left: 260px;
      margin-right: 0;
      margin-top: 64px;
      min-height: calc(100vh - 64px);
      padding: 1.5rem;
      transition: margin 300ms ease-in-out, background-color 200ms;
      background-color: var(--bg-primary, #f5f5f5);
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
      .main-content, .main-content.rtl, .main-content.sidebar-collapsed, .main-content.sidebar-collapsed.rtl {
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
export class LayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private i18nService = inject(I18nService);
  private themeService = inject(ThemeService);
  private menuApiService = inject(MenuApiService);

  sidebarCollapsed = signal(true);
  isMobileView = signal(false);
  menuItems = signal<MenuItem[]>([]);

  constructor() {
    this.checkMobileView();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.checkMobileView());
    }
  }

  ngOnInit(): void {
    this.loadMenuItems();
  }

  private loadMenuItems(): void {
    this.menuApiService.getMenuItems().subscribe({
      next: (items) => this.menuItems.set(items),
      error: (err) => console.error('Failed to load menu items:', err),
    });
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
  isDark = this.themeService.isDark;

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

  onThemeToggle(): void {
    this.themeService.toggleTheme();
  }
}
