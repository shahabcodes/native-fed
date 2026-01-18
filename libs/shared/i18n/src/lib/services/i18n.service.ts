import { Injectable, signal, computed, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EN_TRANSLATIONS } from '../translations/en';
import { AR_TRANSLATIONS } from '../translations/ar';

export type SupportedLanguage = 'en' | 'ar';
export type TextDirection = 'ltr' | 'rtl';

interface TranslationObject {
  [key: string]: string | TranslationObject;
}

const TRANSLATIONS: Record<SupportedLanguage, TranslationObject> = {
  en: EN_TRANSLATIONS as unknown as TranslationObject,
  ar: AR_TRANSLATIONS as unknown as TranslationObject
};

const RTL_LANGUAGES: SupportedLanguage[] = ['ar'];
const STORAGE_KEY = 'mfe_language';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private platformId = inject(PLATFORM_ID);

  private _currentLang = signal<SupportedLanguage>(this.getInitialLanguage());
  private _direction = computed<TextDirection>(() =>
    RTL_LANGUAGES.includes(this._currentLang()) ? 'rtl' : 'ltr'
  );

  readonly currentLang = this._currentLang.asReadonly();
  readonly direction = this._direction;
  readonly isRtl = computed(() => this._direction() === 'rtl');

  constructor() {
    effect(() => {
      const lang = this._currentLang();
      const dir = this._direction();

      if (isPlatformBrowser(this.platformId)) {
        document.documentElement.lang = lang;
        document.documentElement.dir = dir;
        document.body.dir = dir;
        localStorage.setItem(STORAGE_KEY, lang);
      }
    });
  }

  private getInitialLanguage(): SupportedLanguage {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && this.isValidLanguage(stored)) {
        return stored as SupportedLanguage;
      }
      const browserLang = navigator.language.split('-')[0];
      if (this.isValidLanguage(browserLang)) {
        return browserLang as SupportedLanguage;
      }
    }
    return 'en';
  }

  private isValidLanguage(lang: string): boolean {
    return Object.keys(TRANSLATIONS).includes(lang);
  }

  setLanguage(lang: SupportedLanguage): void {
    if (this.isValidLanguage(lang)) {
      this._currentLang.set(lang);
    }
  }

  toggleLanguage(): void {
    const newLang = this._currentLang() === 'en' ? 'ar' : 'en';
    this.setLanguage(newLang);
  }

  translate(key: string, params?: Record<string, string | number>): string {
    const keys = key.split('.');
    let result: string | TranslationObject = TRANSLATIONS[this._currentLang()];

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return key;
      }
    }

    if (typeof result !== 'string') {
      return key;
    }

    if (params) {
      return this.interpolate(result, params);
    }

    return result;
  }

  t(key: string, params?: Record<string, string | number>): string {
    return this.translate(key, params);
  }

  private interpolate(text: string, params: Record<string, string | number>): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? String(params[key]) : match;
    });
  }

  getAvailableLanguages(): SupportedLanguage[] {
    return Object.keys(TRANSLATIONS) as SupportedLanguage[];
  }
}
