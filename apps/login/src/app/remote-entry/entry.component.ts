import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonComponent, CardComponent } from '@mfe-workspace/shared-ui';
import { AuthService, LoginCredentials } from '@mfe-workspace/shared-services';
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

        <div class="language-toggle">
          <button type="button" class="lang-btn" (click)="toggleLanguage()">
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }
    .login-wrapper { width: 100%; max-width: 420px; }
    .login-header { text-align: center; margin-bottom: 2rem; color: white; }
    .login-title { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
    .login-subtitle { opacity: 0.9; font-size: 1rem; }
    .form-group { margin-bottom: 1.25rem; }
    .form-label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151; }
    .form-control {
      width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db;
      border-radius: 8px; font-size: 1rem; transition: border-color 150ms, box-shadow 150ms;
      min-height: 44px;
    }
    .form-control:focus {
      outline: none; border-color: #3f51b5; box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1);
    }
    .form-error { display: block; margin-top: 0.25rem; color: #dc3545; font-size: 0.875rem; }
    .form-check { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; }
    .form-check-input { width: 20px; height: 20px; accent-color: #3f51b5; cursor: pointer; }
    .form-check-label { cursor: pointer; color: #4b5563; }
    .alert-error {
      padding: 0.75rem 1rem; background-color: #fee2e2; border: 1px solid #fecaca;
      border-radius: 8px; color: #dc2626; margin-bottom: 1rem; font-size: 0.875rem;
    }
    .demo-credentials {
      margin-top: 1.5rem; padding: 1rem; background-color: #f3f4f6;
      border-radius: 8px; font-size: 0.875rem; color: #6b7280;
    }
    .demo-credentials p { margin: 0.25rem 0; }
    .demo-credentials strong { color: #374151; }
    .language-toggle { text-align: center; margin-top: 1.5rem; }
    .lang-btn {
      background: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.3);
      color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;
      transition: all 150ms; min-height: 44px;
    }
    .lang-btn:hover { background: rgba(255, 255, 255, 0.3); }

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
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = this.authService.isLoading;
  error = this.authService.error;
  currentLang = this.i18nService.currentLang;

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
}
