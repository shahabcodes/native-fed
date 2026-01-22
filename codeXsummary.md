# CodeX Summary

## Overview

This repository is an Nx-based Angular workspace that implements micro-frontends using Native Federation. The shell host application loads multiple remote apps at runtime via federation manifests, with shared UI, styles, services, and i18n libraries to keep behavior consistent across remotes.

## Applications

- `apps/shell`: Host app, routing/layout, federation bootstrap, SSR server entry.
- `apps/login`: Remote login experience.
- `apps/dashboard`: Remote dashboard experience.
- `apps/inspection`: Remote inspection experience.
- `apps/shell-e2e`: Playwright end-to-end tests for the shell.

Default dev ports (from README): 4200 (shell), 4201 (login), 4202 (dashboard), 4203 (inspection).

## Shared Libraries

- `libs/shared/ui`: Reusable standalone components (header, sidebar, card, button, loading, notifications).
- `libs/shared/styles`: SCSS design tokens, mixins, theme, utilities.
- `libs/shared/services`: Cross-cutting services (auth, API, theme, storage, logging, error handling, safe remote loading).
- `libs/shared/i18n`: Translations (EN/AR), translate pipe, RTL directive, i18n service.
- `libs/shared/mocks`: Mock data and delays for auth, dashboard, inspection.

## Federation and Environment Setup

- Each app has `federation.config.js` for exposed routes/entries.
- Shell reads a federation manifest from `apps/shell/src/assets/` based on environment files in `apps/shell/src/environments/`.
- Manifests map remote names to `remoteEntry.json` URLs for each environment.

## Runtime Flow (High Level)

- Shell bootstraps, loads the federation manifest, and configures routes.
- Routes lazily load remote modules via `loadRemoteModule`.
- Auth guard protects authenticated routes; auth state is shared via services and storage.
- i18n supports LTR/RTL with runtime language toggling; theme service manages light/dark mode.

## Tooling and Scripts

- `npm start`: Serve all apps in parallel (Nx).
- `npm run start:*`: Serve individual apps.
- `npm run build`: Build all apps.
- `npm test`, `npm run lint`, `npm run lint:fix`, `npm run format`: Workspace-level quality checks.

## Notable Files

- `apps/shell/src/main.ts`, `apps/shell/src/bootstrap.ts`: Shell bootstrap and federation init.
- `apps/shell/src/app/app.routes.ts`: Shell routing and remote loading.
- `apps/*/src/app/remote-entry/entry.component.ts`: Remote entry components.
- `libs/shared/services/src/lib`: Core app services and models.
- `libs/shared/i18n/src/lib`: Translation data and i18n helpers.
