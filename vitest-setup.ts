import { Temporal, toTemporalInstant } from '@js-temporal/polyfill';

// Polyfill Temporal
(globalThis as any).Temporal = Temporal;
(Date.prototype as any).toTemporalInstant = toTemporalInstant;

// Polyfill crypto.randomUUID
if (typeof (globalThis as any).crypto === 'undefined') {
  (globalThis as any).crypto = {};
}
if (typeof (globalThis as any).crypto.randomUUID === 'undefined') {
  (globalThis as any).crypto.randomUUID = () => 'test-uuid-' + Math.random().toString(36).substring(2, 9);
}

// Polyfill structuredClone if missing in Node
if (typeof (globalThis as any).structuredClone === 'undefined') {
  (globalThis as any).structuredClone = (val: any) => JSON.parse(JSON.stringify(val));
}

// Polyfill HTMLDialogElement APIs for JSDOM
if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function() {
    this.setAttribute('open', '');
    this.dispatchEvent(new Event('show'));
  };
  HTMLDialogElement.prototype.close = function() {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
}

// Mock IndexedDB for testing in JSDOM environment using queueMicrotask
if (typeof (globalThis as any).indexedDB === 'undefined') {
  (globalThis as any).indexedDB = {
    open: () => {
      const req = {
        onsuccess: null,
        onerror: null,
        onupgradeneeded: null,
        result: {
          objectStoreNames: {
            contains: () => false
          },
          createObjectStore: () => ({}),
          transaction: () => ({
            objectStore: () => ({
              get: () => {
                const getReq = { onsuccess: null };
                queueMicrotask(() => {
                  if (getReq.onsuccess) (getReq as any).onsuccess({ target: { result: null } });
                });
                return getReq;
              },
              put: () => {
                const putReq = { onsuccess: null };
                queueMicrotask(() => {
                  if (putReq.onsuccess) (putReq as any).onsuccess({ target: { result: null } });
                });
                return putReq;
              },
              delete: () => {
                const delReq = { onsuccess: null };
                queueMicrotask(() => {
                  if (delReq.onsuccess) (delReq as any).onsuccess({ target: { result: null } });
                });
                return delReq;
              }
            })
          })
        }
      };

      queueMicrotask(() => {
        if (req.onupgradeneeded) (req as any).onupgradeneeded({ target: { result: req.result } });
        if (req.onsuccess) (req as any).onsuccess({ target: { result: req.result } });
      });

      return req;
    }
  };
}
