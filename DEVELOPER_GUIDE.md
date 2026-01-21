# Developer Guide: Coding Standards & Best Practices

This guide provides coding standards, best practices, and conventions for developers working on the MFE Workspace project.

## Table of Contents

- [Project Structure](#project-structure)
- [Angular Best Practices](#angular-best-practices)
- [Micro-Frontend Guidelines](#micro-frontend-guidelines)
- [Shared Libraries](#shared-libraries)
- [State Management](#state-management)
- [Styling Guidelines](#styling-guidelines)
- [Internationalization (i18n)](#internationalization-i18n)
- [Security Considerations](#security-considerations)
- [Testing Guidelines](#testing-guidelines)
- [Git Workflow](#git-workflow)
- [Common Pitfalls](#common-pitfalls)

---

## Project Structure

### Directory Organization

```
apps/
├── shell/          # Host application - routing & layout only
├── login/          # Authentication remote
├── dashboard/      # Dashboard remote
└── inspection/     # Inspection management remote

libs/shared/
├── ui/             # Reusable UI components
├── styles/         # Global SCSS styles & theming
├── services/       # Shared services (auth, storage, etc.)
├── i18n/           # Internationalization
└── mocks/          # Mock data for development
```

### ✅ DO

- Keep apps thin - business logic should be in services
- Place reusable code in `libs/shared/`
- Use barrel exports (`index.ts`) for clean imports
- Follow the single responsibility principle

### ❌ DON'T

- Don't put shared code directly in apps
- Don't import from one app to another
- Don't create deep nested folder structures
- Don't duplicate code across apps

---

## Angular Best Practices

### Components

#### ✅ DO

```typescript
// Use standalone components
@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `...`,
})
export class MyComponent {
  // Use inject() for dependency injection
  private myService = inject(MyService);

  // Use signals for reactive state
  data = signal<MyData | null>(null);
  isLoading = signal(false);

  // Use computed for derived state
  isEmpty = computed(() => !this.data());
}
```

```typescript
// Use OnPush change detection for better performance
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  ...
})
```

#### ❌ DON'T

```typescript
// Don't use constructor injection (old pattern)
constructor(private myService: MyService) {}

// Don't use BehaviorSubject when signals work
private dataSubject = new BehaviorSubject<MyData | null>(null);

// Don't use ngModules for new components
@NgModule({
  declarations: [MyComponent],
  ...
})
```

### Services

#### ✅ DO

```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  private http = inject(HttpClient);

  // Use signals for service state
  private _items = signal<Item[]>([]);
  readonly items = this._items.asReadonly();

  // Return observables from HTTP methods
  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>('/api/items').pipe(
      tap(items => this._items.set(items))
    );
  }
}
```

#### ❌ DON'T

```typescript
// Don't expose mutable state
public items = signal<Item[]>([]); // Should be readonly

// Don't subscribe in services without cleanup
this.http.get('/api/items').subscribe(items => {
  // Memory leak potential
});
```

### Templates

#### ✅ DO

```html
<!-- Use new control flow syntax -->
@if (isLoading()) {
  <app-loading />
} @else {
  <div>Content</div>
}

@for (item of items(); track item.id) {
  <app-item [data]="item" />
}

<!-- Use async pipe for observables -->
<div *ngIf="data$ | async as data">
  {{ data.name }}
</div>
```

#### ❌ DON'T

```html
<!-- Avoid complex logic in templates -->
<div *ngIf="items.filter(i => i.active && i.status === 'pending').length > 0">

<!-- Don't call methods that do heavy computation -->
<div>{{ calculateComplexValue() }}</div>

<!-- Don't use index as track in ngFor -->
@for (item of items(); track $index) {
  <!-- Bad for performance -->
}
```

---

## Micro-Frontend Guidelines

### Remote Module Exports

#### ✅ DO

```typescript
// federation.config.js - Export routes and entry components
module.exports = {
  exposes: {
    './routes': './apps/my-remote/src/app/my-remote.routes.ts',
    './Component': './apps/my-remote/src/app/remote-entry/entry.component.ts',
  },
};
```

```typescript
// Export routes as a constant
export const MY_REMOTE_ROUTES: Route[] = [
  {
    path: '',
    component: EntryComponent,
  },
];
```

#### ❌ DON'T

```typescript
// Don't export internal services or utilities
module.exports = {
  exposes: {
    './InternalService': '...', // Bad - internal implementation
    './utils': '...',           // Bad - should be in shared lib
  },
};

// Don't create circular dependencies between remotes
import { Something } from 'other-remote'; // Never do this
```

### Communication Between Remotes

#### ✅ DO

```typescript
// Use shared services for cross-remote communication
// libs/shared/services/src/lib/event-bus.service.ts
@Injectable({ providedIn: 'root' })
export class EventBusService {
  private events = signal<AppEvent | null>(null);
  readonly events$ = toObservable(this.events);

  emit(event: AppEvent): void {
    this.events.set(event);
  }
}
```

#### ❌ DON'T

```typescript
// Don't use window events for communication
window.dispatchEvent(new CustomEvent('my-event', { detail: data }));

// Don't store shared state in localStorage for real-time sync
localStorage.setItem('shared-state', JSON.stringify(state));
```

### Loading Remotes

#### ✅ DO

```typescript
// Use loadRemoteModule with error handling
{
  path: 'dashboard',
  loadChildren: () =>
    loadRemoteModule('dashboard', './routes')
      .then(m => m.DASHBOARD_ROUTES)
      .catch(err => {
        console.error('Failed to load dashboard', err);
        return [{ path: '', component: RemoteErrorComponent }];
      }),
}
```

#### ❌ DON'T

```typescript
// Don't load remotes eagerly
import { DashboardModule } from 'dashboard'; // Will break federation

// Don't skip error handling
loadChildren: () => loadRemoteModule('dashboard', './routes')
  .then(m => m.DASHBOARD_ROUTES) // No error handling
```

---

## Shared Libraries

### Creating Shared Components

#### ✅ DO

```typescript
// libs/shared/ui/src/lib/components/my-component.ts
@Component({
  selector: 'lib-my-component',  // Use 'lib-' prefix for shared components
  standalone: true,
  imports: [CommonModule],
  template: `...`,
})
export class MyComponent {
  @Input() data!: MyData;
  @Output() action = new EventEmitter<void>();
}
```

```typescript
// Export from barrel file
// libs/shared/ui/src/index.ts
export * from './lib/components/my-component';
```

#### ❌ DON'T

```typescript
// Don't use app-specific prefixes in shared libs
selector: 'app-my-component'  // Bad - use 'lib-'

// Don't include app-specific logic in shared components
if (this.router.url.includes('/dashboard')) {
  // Bad - shared component shouldn't know about specific routes
}
```

### Using Shared Libraries

#### ✅ DO

```typescript
// Import from library path alias
import { ButtonComponent, CardComponent } from '@mfe-workspace/shared-ui';
import { AuthService } from '@mfe-workspace/shared-services';
import { TranslatePipe } from '@mfe-workspace/shared-i18n';
```

#### ❌ DON'T

```typescript
// Don't use relative paths to libs
import { ButtonComponent } from '../../../libs/shared/ui/src';

// Don't import internal files directly
import { something } from '@mfe-workspace/shared-ui/lib/internal/something';
```

---

## State Management

### Using Signals

#### ✅ DO

```typescript
@Component({...})
export class MyComponent {
  // Private writable signal
  private _count = signal(0);

  // Public readonly signal
  readonly count = this._count.asReadonly();

  // Computed values
  readonly doubled = computed(() => this._count() * 2);

  // Effects for side effects
  constructor() {
    effect(() => {
      console.log('Count changed:', this._count());
    });
  }

  increment(): void {
    this._count.update(c => c + 1);
  }
}
```

#### ❌ DON'T

```typescript
// Don't mix signals and BehaviorSubjects unnecessarily
private countSubject = new BehaviorSubject(0);
count = signal(0); // Redundant

// Don't mutate signal values directly
this.items().push(newItem); // Bad - mutates array
this.items.update(items => [...items, newItem]); // Good

// Don't use signals for one-time values
readonly API_URL = signal('https://api.example.com'); // Overkill
```

### Service State

#### ✅ DO

```typescript
@Injectable({ providedIn: 'root' })
export class CartService {
  // Encapsulate state
  private _items = signal<CartItem[]>([]);
  private _loading = signal(false);

  // Expose readonly
  readonly items = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.price, 0)
  );

  // State mutations through methods
  addItem(item: CartItem): void {
    this._items.update(items => [...items, item]);
  }
}
```

---

## Styling Guidelines

### CSS Architecture

#### ✅ DO

```scss
// Use CSS custom properties for theming
.my-component {
  background-color: var(--card-bg, white);
  color: var(--text-primary, #1f2937);
  border: 1px solid var(--card-border, #e5e7eb);
}

// Use CSS logical properties for RTL support
.sidebar {
  margin-inline-start: 1rem;  // Not margin-left
  padding-inline-end: 1rem;   // Not padding-right
  inset-inline-start: 0;      // Not left: 0
}

// Use BEM-like naming
.card {}
.card__header {}
.card__body {}
.card--highlighted {}
```

#### ❌ DON'T

```scss
// Don't use hard-coded colors
.my-component {
  background-color: #ffffff; // Bad - use CSS variable
  color: #333333;            // Bad - use CSS variable
}

// Don't use physical properties (breaks RTL)
.sidebar {
  margin-left: 1rem;   // Bad - use margin-inline-start
  padding-right: 1rem; // Bad - use padding-inline-end
}

// Don't use !important
.my-class {
  color: red !important; // Avoid this
}
```

### Component Styles

#### ✅ DO

```typescript
@Component({
  styles: [`
    :host {
      display: block;
    }

    .container {
      /* Component-specific styles */
    }
  `]
})
```

#### ❌ DON'T

```typescript
// Don't use ::ng-deep excessively
::ng-deep .some-class {
  // Breaks encapsulation
}

// Don't add global styles in components
styles: [`
  body { /* Bad - affects entire app */ }
`]
```

---

## Internationalization (i18n)

### Adding Translations

#### ✅ DO

```typescript
// libs/shared/i18n/src/lib/translations/en.ts
export const en = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
  },
  dashboard: {
    title: 'Dashboard',
    stats: {
      total: 'Total Items',
    },
  },
};
```

```html
<!-- Use translate pipe -->
<h1>{{ 'dashboard.title' | translate }}</h1>
<button>{{ 'common.save' | translate }}</button>
```

#### ❌ DON'T

```html
<!-- Don't hardcode text -->
<h1>Dashboard</h1>
<button>Save</button>

<!-- Don't use complex expressions in translate -->
<span>{{ ('prefix.' + dynamicKey) | translate }}</span>
```

### RTL Considerations

#### ✅ DO

```typescript
// Check RTL state reactively
private i18nService = inject(I18nService);
isRtl = this.i18nService.isRtl;

// In template
<div [class.rtl]="isRtl()">
```

```scss
// Use logical properties
.icon {
  margin-inline-end: 0.5rem;
}

// Use dir attribute for specific overrides
:host-context([dir="rtl"]) .special-case {
  /* RTL-specific styles */
}
```

---

## Security Considerations

### Rendering HTML Content

#### ✅ DO

```typescript
// Use DomSanitizer for trusted HTML (like SVG icons)
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({...})
export class IconComponent {
  private sanitizer = inject(DomSanitizer);

  @Input() set icon(value: string) {
    this.safeIcon = this.sanitizer.bypassSecurityTrustHtml(value);
  }
  safeIcon: SafeHtml = '';
}
```

```html
<span [innerHTML]="safeIcon"></span>
```

#### ❌ DON'T

```typescript
// Don't bypass security for user-provided content
const userInput = this.getUserInput();
this.sanitizer.bypassSecurityTrustHtml(userInput); // XSS vulnerability!

// Don't use innerHTML without sanitization
<div [innerHTML]="untrustedHtml"></div>
```

### API Security

#### ✅ DO

```typescript
// Use HttpInterceptor for auth tokens
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req);
};
```

#### ❌ DON'T

```typescript
// Don't store sensitive data in localStorage unencrypted
localStorage.setItem('password', this.password);

// Don't expose API keys in frontend code
const API_KEY = 'sk-1234567890'; // Never do this

// Don't disable security features
this.http.get(url, { withCredentials: false }); // Be careful
```

---

## Testing Guidelines

### Unit Tests

#### ✅ DO

```typescript
describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [
        { provide: MyService, useValue: mockMyService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  });

  it('should display data when loaded', () => {
    component.data.set({ name: 'Test' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Test');
  });
});
```

#### ❌ DON'T

```typescript
// Don't test implementation details
it('should call private method', () => {
  spyOn(component as any, '_privateMethod');
  // Testing private methods is a code smell
});

// Don't write brittle tests
it('should have exact HTML structure', () => {
  expect(fixture.nativeElement.innerHTML).toBe('<div class="exact">...</div>');
});
```

---

## Git Workflow

### Commit Messages

#### ✅ DO

```bash
# Use conventional commits
feat(dashboard): add statistics cards
fix(auth): resolve token refresh issue
refactor(ui): simplify button component
docs: update README with deployment guide
chore: update dependencies
```

#### ❌ DON'T

```bash
# Don't use vague messages
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
git commit -m "WIP"
```

### Branch Naming

#### ✅ DO

```bash
feature/add-user-profile
bugfix/fix-login-redirect
refactor/simplify-auth-service
docs/update-api-documentation
```

---

## Common Pitfalls

### 1. Forgetting DomSanitizer for SVG Icons

```typescript
// ❌ Wrong - icons won't render
<span [innerHTML]="svgIcon"></span>

// ✅ Correct
<span [innerHTML]="sanitizer.bypassSecurityTrustHtml(svgIcon)"></span>
```

### 2. Using Physical CSS Properties

```scss
// ❌ Wrong - breaks RTL
margin-left: 1rem;

// ✅ Correct
margin-inline-start: 1rem;
```

### 3. Importing Between Apps

```typescript
// ❌ Wrong - breaks micro-frontend isolation
import { Something } from '../../../apps/other-app/src/app/something';

// ✅ Correct - use shared libraries
import { Something } from '@mfe-workspace/shared-services';
```

### 4. Hardcoding Federation URLs

```typescript
// ❌ Wrong
loadRemoteModule('http://localhost:4201/remoteEntry.json', './routes');

// ✅ Correct - use manifest
loadRemoteModule('login', './routes');
```

### 5. Not Handling Remote Load Errors

```typescript
// ❌ Wrong - no error handling
loadChildren: () => loadRemoteModule('remote', './routes').then(m => m.ROUTES)

// ✅ Correct
loadChildren: () => loadRemoteModule('remote', './routes')
  .then(m => m.ROUTES)
  .catch(() => [{ path: '', component: ErrorComponent }])
```

### 6. Mutating Signal Arrays

```typescript
// ❌ Wrong - mutation doesn't trigger updates
this.items().push(newItem);

// ✅ Correct - create new array
this.items.update(items => [...items, newItem]);
```

### 7. Subscribing Without Cleanup

```typescript
// ❌ Wrong - memory leak
ngOnInit() {
  this.service.data$.subscribe(data => this.data = data);
}

// ✅ Correct - use takeUntilDestroyed or async pipe
private destroyRef = inject(DestroyRef);

ngOnInit() {
  this.service.data$.pipe(
    takeUntilDestroyed(this.destroyRef)
  ).subscribe(data => this.data.set(data));
}
```

---

## Quick Reference

| Task | Do | Don't |
|------|-----|-------|
| Dependency Injection | `inject(Service)` | `constructor(private svc: Service)` |
| State | Signals | BehaviorSubject (for new code) |
| Components | Standalone | NgModules |
| Styles | CSS Variables | Hard-coded colors |
| RTL | Logical properties | Physical properties |
| Imports | Path aliases | Relative paths to libs |
| HTML in TS | DomSanitizer | Raw innerHTML |
| Remote loading | Via manifest | Hard-coded URLs |

---

## Getting Help

- Check existing code for patterns
- Review this guide before PRs
- Ask in team chat for clarifications
- Update this guide when new patterns emerge

---

*Last updated: January 2025*
