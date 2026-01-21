import { loadRemoteModule } from '@angular-architects/native-federation';
import { Route } from '@angular/router';

export interface SafeLoadOptions {
  maxRetries?: number;
  retryDelayMs?: number;
  fallbackRoutes?: Route[];
}

const DEFAULT_OPTIONS: Required<SafeLoadOptions> = {
  maxRetries: 3,
  retryDelayMs: 1000,
  fallbackRoutes: []
};

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadWithRetry<T>(
  loadFn: () => Promise<T>,
  options: Required<SafeLoadOptions>,
  attempt = 1
): Promise<T> {
  try {
    return await loadFn();
  } catch (error) {
    if (attempt >= options.maxRetries) {
      console.error(`Failed to load remote module after ${options.maxRetries} attempts:`, error);
      throw error;
    }

    const delayMs = options.retryDelayMs * Math.pow(2, attempt - 1);
    console.warn(`Remote module load failed (attempt ${attempt}/${options.maxRetries}). Retrying in ${delayMs}ms...`);

    await delay(delayMs);
    return loadWithRetry(loadFn, options, attempt + 1);
  }
}

export function safeLoadRemoteModule(
  remoteName: string,
  exposedModule: string,
  options: SafeLoadOptions = {}
): () => Promise<Route[]> {
  const mergedOptions: Required<SafeLoadOptions> = { ...DEFAULT_OPTIONS, ...options };

  return async () => {
    try {
      const module = await loadWithRetry(
        () => loadRemoteModule(remoteName, exposedModule),
        mergedOptions
      );

      const routesKey = Object.keys(module).find(
        key => key.endsWith('_ROUTES') || key === 'routes'
      );

      if (routesKey && Array.isArray(module[routesKey])) {
        return module[routesKey] as Route[];
      }

      return module as unknown as Route[];
    } catch (error) {
      console.error(`Failed to load remote module "${remoteName}":`, error);

      if (mergedOptions.fallbackRoutes.length > 0) {
        return mergedOptions.fallbackRoutes;
      }

      const { RemoteLoadErrorComponent } = await import('./remote-load-error.component');
      return [
        {
          path: '**',
          component: RemoteLoadErrorComponent,
          data: {
            remoteName,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      ];
    }
  };
}

export function createSafeRemoteRoute(
  path: string,
  remoteName: string,
  exposedModule: string,
  options?: SafeLoadOptions & { canActivate?: Route['canActivate'] }
): Route {
  const { canActivate, ...loadOptions } = options || {};

  return {
    path,
    loadChildren: safeLoadRemoteModule(remoteName, exposedModule, loadOptions),
    ...(canActivate && { canActivate })
  };
}
