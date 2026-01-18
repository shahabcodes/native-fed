const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'shell',
  exposes: {},
  remotes: {
    login: 'http://localhost:4201/remoteEntry.json',
    dashboard: 'http://localhost:4202/remoteEntry.json',
    inspection: 'http://localhost:4203/remoteEntry.json',
  },
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
