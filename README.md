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
│       ├── services/             # Shared services (auth, API, theme)
│       ├── i18n/                 # Internationalization (EN/AR)
│       └── mocks/                # Shared mock data for development
└── federation configs            # Native Federation setup
```

## Code Flow Structure

### Application Bootstrap Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SHELL (Host App)                                │
│                                                                              │
│  1. main.ts                                                                  │
│     │                                                                        │
│     ├──► Load environment config (environment.ts)                           │
│     │                                                                        │
│     ├──► initFederation(environment.federationManifestPath)                 │
│     │         │                                                              │
│     │         └──► Loads federation.manifest.{env}.json                     │
│     │                  ├── login: "http://..."                               │
│     │                  ├── dashboard: "http://..."                           │
│     │                  └── inspection: "http://..."                          │
│     │                                                                        │
│     └──► bootstrap() ──► AppComponent                                       │
│                              │                                               │
│                              └──► Router (app.routes.ts)                    │
│                                       │                                      │
│                                       ├──► /login ──► loadRemoteModule()    │
│                                       │                    └──► Login App   │
│                                       │                                      │
│                                       └──► / (authenticated)                │
│                                            └──► LayoutComponent             │
│                                                 ├── HeaderComponent         │
│                                                 ├── SidebarComponent        │
│                                                 └── <router-outlet>         │
│                                                      │                       │
│                                                      ├──► /dashboard        │
│                                                      │    └──► Dashboard App│
│                                                      │                       │
│                                                      └──► /inspection       │
│                                                           └──► Inspection   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
┌────────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   User Visit   │────►│   AuthGuard     │────►│  Is Authenticated?│
│   /dashboard   │     │                 │     │                  │
└────────────────┘     └─────────────────┘     └────────┬─────────┘
                                                        │
                              ┌──────────────────────────┼──────────────────────┐
                              │ NO                       │ YES                  │
                              ▼                          ▼                      │
                    ┌─────────────────┐       ┌─────────────────┐              │
                    │ Redirect to     │       │ Allow Access    │              │
                    │ /login          │       │ Load Remote     │              │
                    └────────┬────────┘       └─────────────────┘              │
                             │                                                  │
                             ▼                                                  │
                    ┌─────────────────┐                                        │
                    │ Login Component │                                        │
                    │ (Remote App)    │                                        │
                    └────────┬────────┘                                        │
                             │                                                  │
                             ▼                                                  │
                    ┌─────────────────┐     ┌─────────────────┐               │
                    │ Submit          │────►│ AuthService     │               │
                    │ Credentials     │     │ .login()        │               │
                    └─────────────────┘     └────────┬────────┘               │
                                                     │                         │
                                                     ▼                         │
                                            ┌─────────────────┐               │
                                            │ Store Token &   │               │
                                            │ User in Storage │               │
                                            └────────┬────────┘               │
                                                     │                         │
                                                     ▼                         │
                                            ┌─────────────────┐               │
                                            │ Navigate to     │───────────────┘
                                            │ /dashboard      │
                                            └─────────────────┘
```

### Data Flow (Services & State)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SHARED SERVICES LAYER                              │
│                         (libs/shared/services)                               │
│                                                                              │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐     │
│  │ AuthService │   │ThemeService │   │ I18nService │   │StorageService│    │
│  │  (Signals)  │   │  (Signals)  │   │  (Signals)  │   │             │     │
│  └──────┬──────┘   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘     │
│         │                 │                 │                 │             │
│         └─────────────────┴─────────────────┴─────────────────┘             │
│                                    │                                         │
│                                    ▼                                         │
│                         ┌─────────────────────┐                             │
│                         │   providedIn: root  │                             │
│                         │   (Singleton)       │                             │
│                         └──────────┬──────────┘                             │
│                                    │                                         │
└────────────────────────────────────┼─────────────────────────────────────────┘
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        │                            │                            │
        ▼                            ▼                            ▼
┌───────────────┐          ┌───────────────┐          ┌───────────────┐
│  Shell App    │          │ Dashboard App │          │ Inspection App│
│               │          │               │          │               │
│ inject(Auth)  │          │ inject(Auth)  │          │ inject(Auth)  │
│ inject(Theme) │          │ inject(Theme) │          │ inject(Theme) │
│ inject(I18n)  │          │ inject(I18n)  │          │ inject(I18n)  │
└───────────────┘          └───────────────┘          └───────────────┘
```

### Mock Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SHARED MOCKS LAYER                                 │
│                          (libs/shared/mocks)                                 │
│                                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ dashboard.mock  │  │ inspection.mock │  │   auth.mock     │             │
│  │                 │  │                 │  │                 │             │
│  │ MOCK_STATS      │  │ MOCK_INSPECTIONS│  │ MOCK_USERS      │             │
│  │ MOCK_ACTIVITIES │  │                 │  │ findMockUser()  │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
│           │                    │                    │                       │
│           └────────────────────┼────────────────────┘                       │
│                                │                                            │
│                                ▼                                            │
│                    ┌───────────────────────┐                               │
│                    │     mock-delay.ts     │                               │
│                    │   MOCK_DELAYS const   │                               │
│                    └───────────────────────┘                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
              ┌──────────────────────────────────────┐
              │        API Services (per app)        │
              │                                      │
              │  DashboardApiService                 │
              │    └── getStats() ──► MOCK_STATS    │
              │                                      │
              │  InspectionApiService                │
              │    └── getAll() ──► MOCK_INSPECTIONS│
              │                                      │
              │  AuthService                         │
              │    └── login() ──► findMockUser()   │
              └──────────────────────────────────────┘
```

## Features

- **Native Federation**: Browser-native module federation without webpack
- **Independent Deployment**: Each remote can be developed and deployed separately
- **Shared Libraries**: Consistent UI components and services across all apps
- **Internationalization**: Full i18n support with English (LTR) and Arabic (RTL)
- **Runtime Language Switching**: Switch languages without page reload
- **Dark Mode**: Theme toggle with system preference detection
- **Authentication**: Complete auth flow with guards and session management
- **Mock API Layer**: Centralized mock data in shared library
- **Environment Configuration**: Separate configs for dev, staging, production
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

## Environment Configuration

The application supports multiple environments with different federation URLs.

### Environment Files

```
apps/shell/src/environments/
├── environment.ts              # Development (default)
├── environment.staging.ts      # Staging
└── environment.production.ts   # Production
```

### Federation Manifests

```
apps/shell/src/assets/
├── federation.manifest.development.json   # localhost URLs
├── federation.manifest.staging.json       # staging server URLs
└── federation.manifest.production.json    # production server URLs
```

### Environment Structure

```typescript
// environment.ts (Development)
export const environment = {
  production: false,
  federationManifestPath: '/assets/federation.manifest.development.json',
};

// environment.staging.ts
export const environment = {
  production: false,
  federationManifestPath: '/assets/federation.manifest.staging.json',
};

// environment.production.ts
export const environment = {
  production: true,
  federationManifestPath: '/assets/federation.manifest.production.json',
};
```

### Federation Manifest Structure

```json
// federation.manifest.development.json
{
  "login": "http://localhost:4201/remoteEntry.json",
  "dashboard": "http://localhost:4202/remoteEntry.json",
  "inspection": "http://localhost:4203/remoteEntry.json"
}

// federation.manifest.production.json
{
  "login": "https://app.example.com/login/remoteEntry.json",
  "dashboard": "https://app.example.com/dashboard/remoteEntry.json",
  "inspection": "https://app.example.com/inspection/remoteEntry.json"
}
```

## Running the Application

### Development Mode

```bash
# Start all apps (recommended for development)
npm start

# Or start individually
npx nx serve shell
npx nx serve login
npx nx serve dashboard
npx nx serve inspection
```

### Building for Different Environments

```bash
# Development build
npx nx build shell --configuration=development
npx nx build login --configuration=development
npx nx build dashboard --configuration=development
npx nx build inspection --configuration=development

# Staging build
npx nx build shell --configuration=staging
npx nx build login --configuration=production
npx nx build dashboard --configuration=production
npx nx build inspection --configuration=production

# Production build
npx nx build shell --configuration=production
npx nx build login --configuration=production
npx nx build dashboard --configuration=production
npx nx build inspection --configuration=production
```

### Build All Apps

```bash
# Build all for production
npm run build

# Or use nx
npx nx run-many -t build --configuration=production
```

## Deployment Guide

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PRODUCTION DEPLOYMENT                              │
│                                                                              │
│  ┌─────────────────┐                                                        │
│  │   CDN / Nginx   │                                                        │
│  │   Load Balancer │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│           ├──────────────────────┬──────────────────────┬──────────────────┐│
│           │                      │                      │                  ││
│           ▼                      ▼                      ▼                  ▼│
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐   ┌──────┐│
│  │   Shell App     │   │   Login App     │   │  Dashboard App  │   │ ...  ││
│  │   /             │   │   /login/       │   │   /dashboard/   │   │      ││
│  │                 │   │                 │   │                 │   │      ││
│  │ dist/apps/shell │   │ dist/apps/login │   │dist/apps/dashbd │   │      ││
│  └─────────────────┘   └─────────────────┘   └─────────────────┘   └──────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Deployment

#### 1. Update Federation Manifest URLs

Edit the appropriate manifest file with your deployment URLs:

```json
// apps/shell/src/assets/federation.manifest.production.json
{
  "login": "https://cdn.yourapp.com/login/remoteEntry.json",
  "dashboard": "https://cdn.yourapp.com/dashboard/remoteEntry.json",
  "inspection": "https://cdn.yourapp.com/inspection/remoteEntry.json"
}
```

#### 2. Build Applications

```bash
# Build all apps for production
npx nx run-many -t build --configuration=production
```

#### 3. Deploy Build Artifacts

```
dist/
├── apps/
│   ├── shell/          → Deploy to: https://yourapp.com/
│   ├── login/          → Deploy to: https://cdn.yourapp.com/login/
│   ├── dashboard/      → Deploy to: https://cdn.yourapp.com/dashboard/
│   └── inspection/     → Deploy to: https://cdn.yourapp.com/inspection/
```

#### 4. Configure Web Server (Nginx Example)

```nginx
# Shell (main app)
server {
    listen 80;
    server_name yourapp.com;
    root /var/www/shell;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Remote apps
server {
    listen 80;
    server_name cdn.yourapp.com;

    # CORS headers for federation
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "GET, OPTIONS";

    location /login/ {
        alias /var/www/login/;
        try_files $uri $uri/ /login/index.html;
    }

    location /dashboard/ {
        alias /var/www/dashboard/;
        try_files $uri $uri/ /dashboard/index.html;
    }

    location /inspection/ {
        alias /var/www/inspection/;
        try_files $uri $uri/ /inspection/index.html;
    }
}
```

### Docker Deployment

```dockerfile
# Dockerfile for Shell
FROM nginx:alpine
COPY dist/apps/shell /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  shell:
    build:
      context: .
      dockerfile: Dockerfile.shell
    ports:
      - "80:80"

  login:
    build:
      context: .
      dockerfile: Dockerfile.login
    ports:
      - "4201:80"

  dashboard:
    build:
      context: .
      dockerfile: Dockerfile.dashboard
    ports:
      - "4202:80"

  inspection:
    build:
      context: .
      dockerfile: Dockerfile.inspection
    ports:
      - "4203:80"
```

### CI/CD Pipeline Example (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build all apps
        run: npx nx run-many -t build --configuration=production

      - name: Deploy Shell
        run: |
          # Deploy dist/apps/shell to your hosting

      - name: Deploy Login
        run: |
          # Deploy dist/apps/login to your hosting

      - name: Deploy Dashboard
        run: |
          # Deploy dist/apps/dashboard to your hosting

      - name: Deploy Inspection
        run: |
          # Deploy dist/apps/inspection to your hosting
```

### Environment-Specific Deployments

| Environment | Shell URL | Remote URLs | Build Command |
|-------------|-----------|-------------|---------------|
| Development | localhost:4200 | localhost:420x | `npx nx serve shell` |
| Staging | staging.app.com | staging.cdn.app.com/* | `npx nx build shell -c staging` |
| Production | app.com | cdn.app.com/* | `npx nx build shell -c production` |

## Application Flow

1. Navigate to http://localhost:4200
2. Unauthenticated users are redirected to `/login`
3. After login, users land on `/dashboard`
4. Sidebar navigation provides access to all features
5. Use the language switcher (EN/ع) to toggle RTL/LTR
6. Use the theme toggle to switch between light/dark mode

## Project Structure Details

### Shell (Host) Application

The shell serves as the host application that orchestrates remote loading:

- **Path**: `apps/shell/`
- **Port**: 4200
- **Responsibilities**:
  - Main layout with header and sidebar
  - Route configuration for lazy-loading remotes
  - Federation manifest management
  - Environment configuration

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
- `HeaderComponent` - App header with theme/language toggles
- `SidebarComponent` - Navigation sidebar with flyout menus
- `CardComponent` - Flexible card containers
- `ButtonComponent` - Customizable buttons with loading states
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
- `ThemeService` - Dark/light mode management
- `StorageService` - localStorage wrapper
- `LoggerService` - Logging utility
- Models: `User`, `Inspection`, `DashboardStats`, etc.

#### i18n Library (`libs/shared/i18n/`)
- `I18nService` - Language management with signals
- `TranslatePipe` - Template translation
- Translation files for EN and AR

#### Mocks Library (`libs/shared/mocks/`)
- `dashboard.mock.ts` - Dashboard stats and activities
- `inspection.mock.ts` - Inspection list data
- `auth.mock.ts` - User credentials and login helpers
- `mock-delay.ts` - Delay constants for realistic API simulation

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

- **Angular** 19.x
- **Nx** 20.x
- **Native Federation** 19.x
- **TypeScript** 5.x
- **SCSS** with CSS Logical Properties
- **RxJS** 7.x

## Best Practices Implemented

- Standalone components throughout
- Signal-based state management
- Lazy loading for all remotes
- CSS logical properties for RTL
- Centralized theming (light/dark)
- Type-safe translations
- Route guards for auth
- Centralized mock data layer
- Environment-based configuration

## Troubleshooting

### Common Issues

**1. Remote not loading**
- Ensure remote app is running on the correct port
- Check federation manifest URLs are correct
- Verify CORS is enabled on remote servers

**2. Styles not applying**
- Check shared styles are imported in app styles
- Verify CSS variables are defined

**3. Auth not persisting**
- Check localStorage is available
- Verify token keys match between services

**4. Icons not showing**
- SVG icons require DomSanitizer for innerHTML binding
- Check icon strings are valid SVG markup

## Contributing

1. Create feature branch from `main`
2. Follow Angular and Nx conventions
3. Ensure all tests pass
4. Update documentation as needed

## License

MIT
