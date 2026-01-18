const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'dashboard',
  exposes: {
    './routes': './apps/dashboard/src/app/dashboard.routes.ts',
    './Component': './apps/dashboard/src/app/remote-entry/entry.component.ts',
  },
  remotes: {},
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
  skip: [
    'rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket',
    '@angular/router/upgrade', '@angular/common/upgrade',
    '@angular-devkit/build-angular', '@angular/build', '@angular/compiler-cli',
    '@angular/localize', '@angular/ssr', 'ng-packagr', 'karma', 'typescript',
    'esbuild', 'vite', 'rollup', 'express'
  ],
});
