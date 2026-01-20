import { Injectable, signal, computed, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'mfe_theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);

  private _currentTheme = signal<Theme>(this.getInitialTheme());

  readonly currentTheme = this._currentTheme.asReadonly();
  readonly isDark = computed(() => this._currentTheme() === 'dark');

  constructor() {
    effect(() => {
      const theme = this._currentTheme();

      if (isPlatformBrowser(this.platformId)) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
      }
    });
  }

  private getInitialTheme(): Theme {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && this.isValidTheme(stored)) {
        return stored as Theme;
      }
      // Check system preference
      if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  }

  private isValidTheme(theme: string): boolean {
    return theme === 'light' || theme === 'dark';
  }

  setTheme(theme: Theme): void {
    if (this.isValidTheme(theme)) {
      this._currentTheme.set(theme);
    }
  }

  toggleTheme(): void {
    const newTheme = this._currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}
