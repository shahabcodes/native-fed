import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface MenuItem {
  label: string;
  labelAr?: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'lib-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <nav class="sidebar-nav">
        <a
          *ngFor="let item of menuItems"
          [routerLink]="item.route"
          routerLinkActive="active"
          class="nav-item"
        >
          <span class="nav-icon" [innerHTML]="item.icon"></span>
          <span class="nav-label" *ngIf="!collapsed">
            {{ currentLang === 'ar' && item.labelAr ? item.labelAr : item.label }}
          </span>
          <span class="nav-badge" *ngIf="item.badge && !collapsed">{{ item.badge }}</span>
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      top: 64px;
      left: 0;
      bottom: 0;
      width: 260px;
      background-color: white;
      border-inline-end: 1px solid #e5e7eb;
      transition: width 300ms ease-in-out;
      z-index: 90;
      overflow-y: auto;
    }

    [dir='rtl'] .sidebar {
      left: auto;
      right: 0;
    }

    .sidebar.collapsed {
      width: 64px;
    }

    .sidebar-nav {
      padding: 1rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      color: #6b7280;
      text-decoration: none;
      transition: all 150ms;
    }

    .nav-item:hover {
      background-color: #f3f4f6;
      color: #1f2937;
    }

    .nav-item.active {
      background-color: #eff6ff;
      color: #3f51b5;
    }

    .nav-icon {
      display: flex;
      flex-shrink: 0;
    }

    .nav-label {
      flex: 1;
      font-weight: 500;
      white-space: nowrap;
    }

    .nav-badge {
      background-color: #ef4444;
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
    }

    .collapsed .nav-item {
      justify-content: center;
      padding: 0.75rem;
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }

      [dir='rtl'] .sidebar {
        transform: translateX(100%);
      }

      .sidebar.collapsed {
        transform: translateX(0);
        width: 260px;
      }
    }
  `]
})
export class SidebarComponent {
  @Input() menuItems: MenuItem[] = [];
  @Input() collapsed = false;
  @Input() currentLang = 'en';
}
