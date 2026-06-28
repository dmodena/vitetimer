import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Polyfill Temporal if needed
import { Temporal, toTemporalInstant } from '@js-temporal/polyfill';
if (typeof (globalThis as any).Temporal === 'undefined') {
  (globalThis as any).Temporal = Temporal;
  (Date.prototype as any).toTemporalInstant = toTemporalInstant;
}

// Polyfill crypto.randomUUID for non-secure (HTTP) environments
if (typeof (globalThis as any).crypto === 'undefined') {
  (globalThis as any).crypto = {};
}
if (typeof (globalThis as any).crypto.randomUUID === 'undefined') {
  (globalThis as any).crypto.randomUUID = function() {
    return 'uuid-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 15);
  };
}

// Register components
import './components/timer-section';
import './components/calculator-section';
import './components/time-entry';
import './components/changelog-dialog';

// Register the PWA service worker
if ('serviceWorker' in navigator) {
  registerSW({ immediate: true });
}
