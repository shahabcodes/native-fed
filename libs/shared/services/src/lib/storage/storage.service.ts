import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type StorageType = 'local' | 'session';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private getStorage(type: StorageType): Storage | null {
    if (!this.isBrowser) {
      return null;
    }
    return type === 'local' ? localStorage : sessionStorage;
  }

  get<T>(key: string, type: StorageType = 'local'): T | null {
    const storage = this.getStorage(type);
    if (!storage) {
      return null;
    }

    try {
      const item = storage.getItem(key);
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  getString(key: string, type: StorageType = 'local'): string | null {
    const storage = this.getStorage(type);
    if (!storage) {
      return null;
    }
    return storage.getItem(key);
  }

  set<T>(key: string, value: T, type: StorageType = 'local'): boolean {
    const storage = this.getStorage(type);
    if (!storage) {
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      storage.setItem(key, serialized);
      return true;
    } catch {
      return false;
    }
  }

  setString(key: string, value: string, type: StorageType = 'local'): boolean {
    const storage = this.getStorage(type);
    if (!storage) {
      return false;
    }

    try {
      storage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }

  remove(key: string, type: StorageType = 'local'): boolean {
    const storage = this.getStorage(type);
    if (!storage) {
      return false;
    }

    try {
      storage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  clear(type: StorageType = 'local'): boolean {
    const storage = this.getStorage(type);
    if (!storage) {
      return false;
    }

    try {
      storage.clear();
      return true;
    } catch {
      return false;
    }
  }

  has(key: string, type: StorageType = 'local'): boolean {
    const storage = this.getStorage(type);
    if (!storage) {
      return false;
    }
    return storage.getItem(key) !== null;
  }

  keys(type: StorageType = 'local'): string[] {
    const storage = this.getStorage(type);
    if (!storage) {
      return [];
    }

    const keys: string[] = [];
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key !== null) {
        keys.push(key);
      }
    }
    return keys;
  }
}
