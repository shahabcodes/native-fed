import { initFederation } from '@angular-architects/native-federation';
import { environment } from './environments/environment';

function showFederationError(error: Error): void {
  const errorHtml = `
    <div style="
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      padding: 2rem;
    ">
      <div style="
        text-align: center;
        max-width: 500px;
        background: white;
        padding: 3rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      ">
        <div style="
          width: 80px;
          height: 80px;
          margin: 0 auto 1.5rem;
          border-radius: 50%;
          background: #fef2f2;
          border: 3px solid #ef4444;
          color: #ef4444;
          font-size: 2.5rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        ">!</div>
        <h1 style="font-size: 1.5rem; color: #1f2937; margin: 0 0 1rem;">
          Application Failed to Load
        </h1>
        <p style="color: #6b7280; line-height: 1.6; margin: 0 0 1.5rem;">
          We couldn't initialize the application. This might be due to a network issue
          or missing configuration.
        </p>
        <pre style="
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          overflow-x: auto;
          text-align: left;
          font-size: 0.875rem;
          color: #6b7280;
        ">${error.message}</pre>
        <button onclick="window.location.reload()" style="
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
          background: #3f51b5;
          color: white;
          border: none;
        ">
          Retry
        </button>
      </div>
    </div>
  `;
  document.body.innerHTML = errorHtml;
}

initFederation(environment.federationManifestPath)
  .catch((err) => {
    console.error('Federation initialization failed:', err);
    showFederationError(err);
    throw err;
  })
  .then(() => import('./bootstrap'))
  .catch((err) => {
    console.error('Bootstrap failed:', err);
    showFederationError(err);
  });
