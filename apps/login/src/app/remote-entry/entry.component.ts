import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonComponent, CardComponent } from '@mfe-workspace/shared-ui';
import { AuthService, LoginCredentials, ThemeService } from '@mfe-workspace/shared-services';
import { I18nService, TranslatePipe } from '@mfe-workspace/shared-i18n';

@Component({
  selector: 'app-login-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, CardComponent, TranslatePipe],
  template: `
    <div class="login-container">
      <div class="login-wrapper">
        <div class="login-header">
          <h1 class="login-title">{{ 'auth.signInTitle' | translate }}</h1>
          <p class="login-subtitle">{{ 'auth.signInSubtitle' | translate }}</p>
        </div>

        <lib-card>
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <div class="form-group">
              <label class="form-label" for="email">{{ 'auth.email' | translate }}</label>
              <input
                type="email"
                id="email"
                name="email"
                class="form-control"
                [(ngModel)]="credentials.email"
                required
                email
                #emailInput="ngModel"
                placeholder="admin@example.com"
              />
              <span class="form-error" *ngIf="emailInput.invalid && emailInput.touched">
                {{ 'errors.email' | translate }}
              </span>
            </div>

            <div class="form-group">
              <label class="form-label" for="password">{{ 'auth.password' | translate }}</label>
              <input
                type="password"
                id="password"
                name="password"
                class="form-control"
                [(ngModel)]="credentials.password"
                required
                minlength="6"
                #passwordInput="ngModel"
                placeholder="password"
              />
              <span class="form-error" *ngIf="passwordInput.invalid && passwordInput.touched">
                {{ 'errors.required' | translate }}
              </span>
            </div>

            <div class="form-check">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                class="form-check-input"
                [(ngModel)]="credentials.rememberMe"
              />
              <label class="form-check-label" for="rememberMe">
                {{ 'auth.rememberMe' | translate }}
              </label>
            </div>

            <div class="alert alert-error" *ngIf="error()">{{ error() }}</div>

            <lib-button
              type="submit"
              variant="primary"
              [block]="true"
              [loading]="isLoading()"
              [disabled]="!!loginForm.invalid"
            >
              {{ 'auth.signIn' | translate }}
            </lib-button>

            <div class="demo-credentials">
              <p><strong>Demo Credentials:</strong></p>
              <p>Admin: admin&#64;example.com / password</p>
              <p>Inspector: inspector&#64;example.com / password</p>
            </div>
          </form>
        </lib-card>

        <div class="toggle-buttons">
          <button type="button" class="toggle-btn theme-toggle" (click)="toggleTheme()" [attr.aria-label]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'">
            <!-- Sun icon for dark mode -->
            <svg *ngIf="isDark()" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
            <svg *ngIf="!isDark()" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
          <button type="button" class="toggle-btn" (click)="toggleLanguage()">
            {{ currentLang() === 'en' ? 'العربية' : 'English' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--bg-gradient-start, #667eea) 0%, var(--bg-gradient-end, #764ba2) 100%);
      padding: 1rem;
      transition: background 300ms ease-in-out;
    }
    .login-wrapper { width: 100%; max-width: 420px; }
    .login-header { text-align: center; margin-bottom: 2rem; color: var(--toggle-text, white); }
    .login-title { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
    .login-subtitle { opacity: 0.9; font-size: 1rem; }
    .form-group { margin-bottom: 1.25rem; }
    .form-label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--input-text, #374151); }
    .form-control {
      width: 100%; padding: 0.75rem 1rem;
      border: 1px solid var(--input-border, #d1d5db);
      background-color: var(--input-bg, white);
      color: var(--input-text, #374151);
      border-radius: 8px; font-size: 1rem;
      transition: border-color 150ms, box-shadow 150ms, background-color 150ms;
      min-height: 44px;
    }
    .form-control::placeholder { color: var(--input-placeholder, #9ca3af); }
    .form-control:focus {
      outline: none;
      border-color: var(--input-focus-border, #3f51b5);
      box-shadow: 0 0 0 3px var(--input-focus-shadow, rgba(63, 81, 181, 0.1));
    }
    .form-error { display: block; margin-top: 0.25rem; color: var(--alert-error-text, #dc3545); font-size: 0.875rem; }
    .form-check { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; }
    .form-check-input { width: 20px; height: 20px; accent-color: var(--checkbox-accent, #3f51b5); cursor: pointer; }
    .form-check-label { cursor: pointer; color: var(--text-secondary, #4b5563); }
    .alert-error {
      padding: 0.75rem 1rem;
      background-color: var(--alert-error-bg, #fee2e2);
      border: 1px solid var(--alert-error-border, #fecaca);
      border-radius: 8px;
      color: var(--alert-error-text, #dc2626);
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }
    .demo-credentials {
      margin-top: 1.5rem; padding: 1rem;
      background-color: var(--demo-bg, #f3f4f6);
      border-radius: 8px; font-size: 0.875rem;
      color: var(--demo-text, #6b7280);
      transition: background-color 150ms;
    }
    .demo-credentials p { margin: 0.25rem 0; }
    .demo-credentials strong { color: var(--demo-text-strong, #374151); }
    .toggle-buttons { display: flex; justify-content: center; gap: 0.75rem; margin-top: 1.5rem; }
    .toggle-btn {
      background: var(--toggle-bg, rgba(255, 255, 255, 0.2));
      border: 1px solid var(--toggle-border, rgba(255, 255, 255, 0.3));
      color: var(--toggle-text, white);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 150ms;
      min-height: 44px;
      font-size: 1rem;
    }
    .toggle-btn:hover { background: var(--toggle-bg-hover, rgba(255, 255, 255, 0.3)); }
    .theme-toggle { display: flex; align-items: center; justify-content: center; padding: 0.5rem; min-width: 44px; }

    @media (max-width: 576px) {
      .login-container { padding: 0.75rem; }
      .login-header { margin-bottom: 1.5rem; }
      .login-title { font-size: 1.5rem; }
      .login-subtitle { font-size: 0.9375rem; }
      .form-group { margin-bottom: 1rem; }
      .demo-credentials { padding: 0.75rem; font-size: 0.8125rem; }
    }

    @media (max-width: 400px) {
      .login-title { font-size: 1.375rem; }
    }
  `]
})
export class RemoteEntryComponent {
  private authService = inject(AuthService);
  private i18nService = inject(I18nService);
  private themeService = inject(ThemeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = this.authService.isLoading;
  error = this.authService.error;
  currentLang = this.i18nService.currentLang;
  isDark = this.themeService.isDark;

  credentials: LoginCredentials = { email: '', password: '', rememberMe: false };

  async onSubmit(): Promise<void> {
    const success = await this.authService.login(this.credentials);
    if (success) {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
      this.router.navigateByUrl(returnUrl);
    }
  }

  toggleLanguage(): void {
    this.i18nService.toggleLanguage();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
