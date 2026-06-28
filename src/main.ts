import './index.css';

// Polyfill Temporal if needed
import { Temporal, toTemporalInstant } from '@js-temporal/polyfill';
if (typeof (globalThis as any).Temporal === 'undefined') {
  (globalThis as any).Temporal = Temporal;
  (Date.prototype as any).toTemporalInstant = toTemporalInstant;
}

// Register components
import './components/timer-section';
import './components/calculator-section';
import './components/time-entry';
import './components/changelog-dialog';
