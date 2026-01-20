import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface MenuItem {
  id?: string;
  label: string;
  labelAr?: string;
  icon: string;
  route?: string;
  queryParams?: Record<string, string>;
  badge?: number;
  children?: MenuItem[];
  exactMatch?: boolean;
}

@Component({
  selector: 'lib-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed" [class.rtl]="isRtl">
      <nav class="sidebar-nav">
        <ng-container *ngFor="let item of menuItems">
          <!-- Single menu item (no children) -->
          <a
            *ngIf="!item.children || item.children.length === 0"
            [routerLink]="item.route"
            [queryParams]="item.queryParams"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: item.exactMatch !== false }"
            class="nav-item"
          >
            <span class="nav-icon" [innerHTML]="item.icon"></span>
            <span class="nav-label" *ngIf="!collapsed">
              {{ getLabel(item) }}
            </span>
            <span class="nav-badge" *ngIf="item.badge && !collapsed">{{ item.badge }}</span>
          </a>

          <!-- Nested menu item (has children) -->
          <div *ngIf="item.children && item.children.length > 0" class="nav-group">
            <button
              class="nav-item nav-parent"
              [class.expanded]="isExpanded(item)"
              (click)="toggleExpand(item)"
            >
              <span class="nav-icon" [innerHTML]="item.icon"></span>
              <span class="nav-label" *ngIf="!collapsed">
                {{ getLabel(item) }}
              </span>
              <span class="nav-badge" *ngIf="item.badge && !collapsed">{{ item.badge }}</span>
              <span class="nav-arrow" *ngIf="!collapsed" [class.rotated]="isExpanded(item)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </button>

            <!-- Children submenu -->
            <div class="nav-children" *ngIf="!collapsed && isExpanded(item)">
              <a
                *ngFor="let child of item.children"
                [routerLink]="child.route"
                [queryParams]="child.queryParams"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                class="nav-item nav-child"
              >
                <span class="nav-icon child-icon" [innerHTML]="child.icon"></span>
                <span class="nav-label">
                  {{ getLabel(child) }}
                </span>
                <span class="nav-badge" *ngIf="child.badge">{{ child.badge }}</span>
              </a>
            </div>
          </div>
        </ng-container>
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
      background-color: var(--card-bg, white);
      border-inline-end: 1px solid var(--card-border, #e5e7eb);
      transition: width 300ms ease-in-out, background-color 200ms, border-color 200ms;
      z-index: 90;
      overflow-y: auto;
    }

    .sidebar.rtl {
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
      color: var(--text-tertiary, #6b7280);
      text-decoration: none;
      transition: all 150ms;
      border: none;
      background: none;
      width: 100%;
      cursor: pointer;
      font-size: inherit;
      font-family: inherit;
      text-align: start;
    }

    .nav-item:hover {
      background-color: var(--demo-bg, #f3f4f6);
      color: var(--text-primary, #1f2937);
    }

    .nav-item.active {
      background-color: var(--btn-secondary-bg-hover, #eff6ff);
      color: var(--btn-primary-bg, #3f51b5);
    }

    .nav-parent {
      position: relative;
    }

    .nav-parent.expanded {
      background-color: var(--demo-bg, #f9fafb);
      color: var(--text-primary, #1f2937);
    }

    .nav-icon {
      display: flex;
      flex-shrink: 0;
    }

    .child-icon {
      width: 20px;
      height: 20px;
    }

    .child-icon :deep(svg) {
      width: 18px;
      height: 18px;
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

    .nav-arrow {
      display: flex;
      align-items: center;
      transition: transform 200ms ease-in-out;
      color: var(--text-tertiary, #9ca3af);
    }

    .nav-arrow.rotated {
      transform: rotate(180deg);
    }

    .rtl .nav-arrow {
      transform: scaleX(-1);
    }

    .rtl .nav-arrow.rotated {
      transform: scaleX(-1) rotate(180deg);
    }

    .nav-group {
      display: flex;
      flex-direction: column;
    }

    .nav-children {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      padding-inline-start: 1rem;
      margin-top: 0.25rem;
      border-inline-start: 2px solid var(--card-border, #e5e7eb);
      margin-inline-start: 1.5rem;
    }

    .nav-child {
      padding: 0.5rem 0.75rem;
      font-size: 0.9375rem;
    }

    .nav-child .nav-icon {
      opacity: 0.7;
    }

    .collapsed .nav-item {
      justify-content: center;
      padding: 0.75rem;
    }

    .collapsed .nav-children {
      display: none;
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        width: 280px;
      }

      .sidebar.rtl {
        transform: translateX(100%);
      }

      .sidebar:not(.collapsed) {
        transform: translateX(0);
      }

      .sidebar.rtl:not(.collapsed) {
        transform: translateX(0);
      }

      .sidebar.collapsed {
        transform: translateX(-100%);
      }

      .sidebar.collapsed.rtl {
        transform: translateX(100%);
      }
    }
  `]
})
export class SidebarComponent {
  @Input() menuItems: MenuItem[] = [];
  @Input() collapsed = false;
  @Input() currentLang = 'en';
  @Input() isRtl = false;

  private expandedItems = signal<Set<string>>(new Set());

  getLabel(item: MenuItem): string {
    return this.currentLang === 'ar' && item.labelAr ? item.labelAr : item.label;
  }

  getItemId(item: MenuItem): string {
    return item.id || item.label;
  }

  isExpanded(item: MenuItem): boolean {
    return this.expandedItems().has(this.getItemId(item));
  }

  toggleExpand(item: MenuItem): void {
    const id = this.getItemId(item);
    this.expandedItems.update(set => {
      const newSet = new Set(set);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }
}
