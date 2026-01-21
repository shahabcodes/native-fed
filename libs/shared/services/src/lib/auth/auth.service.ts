import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginCredentials, LoginResponse, AuthState } from '../models/user.model';
import { StorageService } from '../storage/storage.service';
import { LoggerService } from '../logger/logger.service';
import {
  findMockUser,
  createMockLoginResponse,
  MOCK_DELAYS,
} from '@mfe-workspace/shared-mocks';

const TOKEN_KEY = 'mfe_auth_token';
const USER_KEY = 'mfe_auth_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private storage = inject(StorageService);
  private logger = inject(LoggerService);

  private _state = signal<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  });

  readonly state = this._state.asReadonly();
  readonly user = computed(() => this._state().user);
  readonly isAuthenticated = computed(() => this._state().isAuthenticated);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly error = computed(() => this._state().error);

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.storage.getString(TOKEN_KEY);
    const user = this.storage.get<User>(USER_KEY);

    if (token && user) {
      this.logger.debug('Restoring auth state from storage', { userId: user.id }, 'AuthService');
      this._state.set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    }
  }

  async login(credentials: LoginCredentials): Promise<boolean> {
    this._state.update(state => ({ ...state, isLoading: true, error: null }));

    try {
      const response = await this.mockLoginApi(credentials);

      if (response) {
        this.setAuthData(response);
        return true;
      }

      this._state.update(state => ({
        ...state,
        isLoading: false,
        error: 'Invalid credentials'
      }));
      return false;
    } catch (error) {
      this._state.update(state => ({
        ...state,
        isLoading: false,
        error: 'Login failed. Please try again.'
      }));
      return false;
    }
  }

  logout(): void {
    this.logger.info('User logged out', undefined, 'AuthService');
    this.clearStorage();
    this._state.set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
    this.router.navigate(['/login']);
  }

  private setAuthData(response: LoginResponse): void {
    this.storage.setString(TOKEN_KEY, response.token);
    this.storage.set(USER_KEY, response.user);
    this.logger.info('User logged in', { userId: response.user.id }, 'AuthService');

    this._state.set({
      user: response.user,
      token: response.token,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
  }

  private clearStorage(): void {
    this.storage.remove(TOKEN_KEY);
    this.storage.remove(USER_KEY);
  }

  getToken(): string | null {
    return this._state().token;
  }

  getUserFullName(): string {
    const user = this._state().user;
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`;
  }

  private mockLoginApi(credentials: LoginCredentials): Promise<LoginResponse | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = findMockUser(credentials);
        if (mockUser) {
          resolve(createMockLoginResponse(mockUser));
        } else {
          resolve(null);
        }
      }, MOCK_DELAYS.AUTH);
    });
  }
}
