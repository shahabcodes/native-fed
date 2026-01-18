# Angular Native Micro-Frontend Workspace

A production-ready Angular Micro-Frontend architecture using Nx and Native Federation, featuring independent deployable applications, shared libraries, and full RTL/LTR internationalization support.

## Architecture Overview

```
mfe-workspace/
├── apps/
│   ├── shell/                    # Host application (port 4200)
│   ├── login/                    # Login remote (port 4201)
│   ├── dashboard/                # Dashboard remote (port 4202)
│   └── inspection/               # Inspection remote (port 4203)
├── libs/
│   └── shared/
│       ├── ui/                   # Shared UI components
│       ├── styles/               # Shared SCSS styles & theming
│       ├── services/             # Shared services (auth, API)
│       └── i18n/                 # Internationalization (EN/AR)
└── federation configs           # Native Federation setup
```

## Features

- **Native Federation**: Browser-native module federation without webpack
- **Independent Deployment**: Each remote can be developed and deployed separately
- **Shared Libraries**: Consistent UI components and services across all apps
- **Internationalization**: Full i18n support with English (LTR) and Arabic (RTL)
- **Runtime Language Switching**: Switch languages without page reload
- **Authentication**: Complete auth flow with guards and session management
- **Mock API Layer**: Easily replaceable mock services for each remote
- **Nx Best Practices**: Project tags, dependency constraints, and caching

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
cd mfe-workspace
npm install
```

### Development

Start all applications simultaneously:

```bash
npm start
```

Or start individual applications:

```bash
npm run start:shell       # Shell on http://localhost:4200
npm run start:login       # Login on http://localhost:4201
npm run start:dashboard   # Dashboard on http://localhost:4202
npm run start:inspection  # Inspection on http://localhost:4203
```

### Demo Credentials

- **Admin**: admin@example.com / password
- **Inspector**: inspector@example.com / password

## Application Flow

1. Navigate to http://localhost:4200
2. Unauthenticated users are redirected to `/login`
3. After login, users land on `/dashboard`
4. Sidebar navigation provides access to all features
5. Use the language switcher (EN/ع) to toggle RTL/LTR

## Project Structure Details

### Shell (Host) Application

The shell serves as the host application that orchestrates remote loading:

- **Path**: `apps/shell/`
- **Port**: 4200
- **Responsibilities**:
  - Main layout with header and sidebar
  - Route configuration for lazy-loading remotes
  - Federation manifest management

### Remote Applications

#### Login (`apps/login/`)
- Standalone authentication UI
- Form validation
- Language toggle on login page
- Demo credentials display

#### Dashboard (`apps/dashboard/`)
- Statistics cards with real-time data
- Recent activity feed
- Quick action shortcuts
- Mock API service for stats

#### Inspection (`apps/inspection/`)
- Inspection list with filtering
- Inspection detail view
- Finding management
- Status tracking

### Shared Libraries

#### UI Library (`libs/shared/ui/`)
Reusable Angular components:
- `ButtonComponent` - Customizable buttons with loading states
- `CardComponent` - Flexible card containers
- `HeaderComponent` - App header with user menu
- `SidebarComponent` - Navigation sidebar
- `LanguageSwitcherComponent` - EN/AR toggle
- `LoadingComponent` - Loading states

#### Styles Library (`libs/shared/styles/`)
SCSS architecture:
- `_variables.scss` - Design tokens (colors, spacing, typography)
- `_mixins.scss` - Reusable style mixins
- `_base.scss` - Reset and utility classes
- `_components.scss` - Component styles
- `_rtl.scss` - RTL-specific styles

#### Services Library (`libs/shared/services/`)
- `AuthService` - Authentication with signals
- `AuthGuard` - Route protection
- `BaseApiService` - HTTP client base class
- Models: `User`, `Inspection`, etc.

#### i18n Library (`libs/shared/i18n/`)
- `I18nService` - Language management with signals
- `TranslatePipe` - Template translation
- `RtlAwareDirective` - Automatic direction
- Translation files for EN and AR

## Federation Configuration

### Shell (Host)
```javascript
// apps/shell/federation.config.js
remotes: {
  login: 'http://localhost:4201/remoteEntry.json',
  dashboard: 'http://localhost:4202/remoteEntry.json',
  inspection: 'http://localhost:4203/remoteEntry.json',
}
```

### Remote Example
```javascript
// apps/dashboard/federation.config.js
exposes: {
  './routes': './apps/dashboard/src/app/dashboard.routes.ts',
  './Component': './apps/dashboard/src/app/remote-entry/entry.component.ts',
}
```

## Routing Configuration

### Shell Routes
```typescript
const appRoutes: Route[] = [
  {
    path: 'login',
    canActivate: [publicGuard],
    loadChildren: () =>
      loadRemoteModule('login', './routes').then(m => m.LOGIN_ROUTES)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          loadRemoteModule('dashboard', './routes').then(m => m.DASHBOARD_ROUTES)
      },
      // ... more routes
    ]
  }
];
```

## RTL/LTR Support

The application uses CSS logical properties for automatic RTL support:

```scss
// Use logical properties instead of physical
margin-inline-start: 1rem;  // Instead of margin-left
padding-inline-end: 1rem;   // Instead of padding-right
inset-inline-start: 0;      // Instead of left: 0
```

### Runtime Direction Switching
```typescript
// In any component
private i18nService = inject(I18nService);

// Toggle language
this.i18nService.toggleLanguage();

// Get current direction
const dir = this.i18nService.direction(); // 'ltr' | 'rtl'
```

## Mock API Services

Each remote has its own mock API service that can be easily replaced:

```typescript
// apps/dashboard/src/app/services/dashboard-api.service.ts
@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  getStats(): Observable<DashboardStats> {
    // Mock implementation - replace with real HTTP calls
    return of(mockStats).pipe(delay(500));
  }
}
```

## Adding a New Remote

1. Generate the application:
```bash
npx nx g @nx/angular:application --name=my-remote --directory=apps/my-remote --routing --style=scss --standalone --port=4204
```

2. Create federation config (`apps/my-remote/federation.config.js`)

3. Update shell's federation manifest (`apps/shell/src/assets/federation.manifest.json`)

4. Add routes in shell (`apps/shell/src/app/app.routes.ts`)

5. Update project.json with federation executor

## Build & Production

### Build all applications:
```bash
npm run build
```

### Build specific application:
```bash
npm run build:shell
npm run build:login
npm run build:dashboard
npm run build:inspection
```

### Production Deployment Considerations

1. **Update federation manifest** with production URLs
2. **Configure CORS** on remote servers
3. **Use CDN** for static assets
4. **Enable compression** (gzip/brotli)

## Testing

```bash
npm test              # Run all tests
npm run lint          # Lint all projects
npm run lint:fix      # Auto-fix lint issues
```

## Nx Commands

```bash
npx nx graph          # View dependency graph
npx nx affected:test  # Test affected projects
npx nx affected:build # Build affected projects
npx nx list           # List installed plugins
```

## Technology Stack

- **Angular** 21.x
- **Nx** 22.x
- **Native Federation** 21.x
- **TypeScript** 5.9
- **SCSS** with CSS Logical Properties
- **RxJS** 7.8

## Best Practices Implemented

- Standalone components throughout
- Signal-based state management
- Lazy loading for all remotes
- CSS logical properties for RTL
- Centralized theming
- Type-safe translations
- Route guards for auth
- Modular mock API layer

## Contributing

1. Create feature branch from `main`
2. Follow Angular and Nx conventions
3. Ensure all tests pass
4. Update documentation as needed

## License

MIT

# native-fed
Native FED POC
