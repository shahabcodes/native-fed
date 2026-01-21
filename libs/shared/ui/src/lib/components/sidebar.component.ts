import { Component, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
            [title]="collapsed ? getLabel(item) : ''"
          >
            <span class="nav-icon" [innerHTML]="sanitizeIcon(item.icon)"></span>
            <span class="nav-label" *ngIf="!collapsed">
              {{ getLabel(item) }}
            </span>
            <span class="nav-badge" *ngIf="item.badge && !collapsed">{{ item.badge }}</span>
          </a>

          <!-- Nested menu item (has children) -->
          <div *ngIf="item.children && item.children.length > 0" class="nav-group"
               (mouseenter)="onGroupHover(item, true)"
               (mouseleave)="onGroupHover(item, false)">
            <button
              class="nav-item nav-parent"
              [class.expanded]="isExpanded(item)"
              [class.flyout-open]="collapsed && isHovered(item)"
              (click)="toggleExpand(item)"
              [title]="collapsed ? getLabel(item) : ''"
            >
              <span class="nav-icon" [innerHTML]="sanitizeIcon(item.icon)"></span>
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

            <!-- Children submenu (expanded mode) -->
            <div class="nav-children" *ngIf="!collapsed && isExpanded(item)">
              <a
                *ngFor="let child of item.children"
                [routerLink]="child.route"
                [queryParams]="child.queryParams"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                class="nav-item nav-child"
              >
                <span class="nav-icon child-icon" [innerHTML]="sanitizeIcon(child.icon)"></span>
                <span class="nav-label">
                  {{ getLabel(child) }}
                </span>
                <span class="nav-badge" *ngIf="child.badge">{{ child.badge }}</span>
              </a>
            </div>

            <!-- Flyout menu (collapsed mode) -->
            <div class="nav-flyout"
                 *ngIf="collapsed && isHovered(item)"
                 [class.rtl]="isRtl"
                 (mouseenter)="onGroupHover(item, true)"
                 (mouseleave)="onGroupHover(item, false)">
              <div class="flyout-header">{{ getLabel(item) }}</div>
              <a
                *ngFor="let child of item.children"
                [routerLink]="child.route"
                [queryParams]="child.queryParams"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                class="nav-item nav-child flyout-item"
                (click)="onFlyoutItemClick()"
              >
                <span class="nav-icon child-icon" [innerHTML]="sanitizeIcon(child.icon)"></span>
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
      overflow: visible;
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

    .nav-parent.expanded,
    .nav-parent.flyout-open {
      background-color: var(--demo-bg, #f9fafb);
      color: var(--text-primary, #1f2937);
    }

    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 24px;
      height: 24px;
    }

    .nav-icon ::ng-deep svg {
      width: 24px;
      height: 24px;
    }

    .child-icon {
      width: 20px;
      height: 20px;
    }

    .child-icon ::ng-deep svg {
      width: 20px;
      height: 20px;
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
      position: relative;
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

    /* Flyout menu styles */
    .nav-flyout {
      position: absolute;
      left: calc(100% - 8px);
      top: -8px;
      min-width: 200px;
      background-color: var(--card-bg, white);
      border: 1px solid var(--card-border, #e5e7eb);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 0.5rem;
      padding-left: 16px;
      z-index: 100;
    }

    .nav-flyout::before {
      content: '';
      position: absolute;
      left: -8px;
      top: 0;
      bottom: 0;
      width: 16px;
      background: transparent;
    }

    .nav-flyout.rtl {
      left: auto;
      right: calc(100% - 8px);
      padding-left: 0.5rem;
      padding-right: 16px;
    }

    .nav-flyout.rtl::before {
      left: auto;
      right: -8px;
    }

    .flyout-header {
      padding: 0.5rem 0.75rem;
      font-weight: 600;
      color: var(--text-primary, #1f2937);
      font-size: 0.875rem;
      border-bottom: 1px solid var(--card-border, #e5e7eb);
      margin-bottom: 0.25rem;
    }

    .flyout-item {
      justify-content: flex-start !important;
      padding: 0.5rem 0.75rem !important;
      gap: 0.5rem !important;
    }

    .flyout-item .nav-icon {
      opacity: 0.7;
    }

    .flyout-item:hover .nav-icon {
      opacity: 1;
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
  private sanitizer = inject(DomSanitizer);

  @Input() menuItems: MenuItem[] = [];
  @Input() collapsed = false;
  @Input() currentLang = 'en';
  @Input() isRtl = false;

  private expandedItems = signal<Set<string>>(new Set());
  private hoveredItems = signal<Set<string>>(new Set());
  private iconCache = new Map<string, SafeHtml>();
  private hoverTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

  sanitizeIcon(icon: string): SafeHtml {
    if (!icon) return '';

    let cached = this.iconCache.get(icon);
    if (!cached) {
      cached = this.sanitizer.bypassSecurityTrustHtml(icon);
      this.iconCache.set(icon, cached);
    }
    return cached;
  }

  getLabel(item: MenuItem): string {
    return this.currentLang === 'ar' && item.labelAr ? item.labelAr : item.label;
  }

  getItemId(item: MenuItem): string {
    return item.id || item.label;
  }

  isExpanded(item: MenuItem): boolean {
    return this.expandedItems().has(this.getItemId(item));
  }

  isHovered(item: MenuItem): boolean {
    return this.hoveredItems().has(this.getItemId(item));
  }

  toggleExpand(item: MenuItem): void {
    if (this.collapsed) return;
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

  onGroupHover(item: MenuItem, isHovering: boolean): void {
    if (!this.collapsed) return;
    const id = this.getItemId(item);

    // Clear any existing timeout for this item
    const existingTimeout = this.hoverTimeouts.get(id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      this.hoverTimeouts.delete(id);
    }

    if (isHovering) {
      // Show immediately on hover
      this.hoveredItems.update(set => {
        const newSet = new Set(set);
        newSet.add(id);
        return newSet;
      });
    } else {
      // Delay hiding to allow cursor to move to flyout
      const timeout = setTimeout(() => {
        this.hoveredItems.update(set => {
          const newSet = new Set(set);
          newSet.delete(id);
          return newSet;
        });
        this.hoverTimeouts.delete(id);
      }, 150);
      this.hoverTimeouts.set(id, timeout);
    }
  }

  onFlyoutItemClick(): void {
    // Clear all hover states when a flyout item is clicked
    this.hoveredItems.set(new Set());
    this.hoverTimeouts.forEach(timeout => clearTimeout(timeout));
    this.hoverTimeouts.clear();
  }
}
