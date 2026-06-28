import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock DB storage calls before loading the calculator code
vi.mock('../utils/storage', () => ({
  loadCalculatorEntries: vi.fn().mockResolvedValue([
    { id: '1', durationISO: 'PT10M', description: 'Existing note' }
  ]),
  saveCalculatorEntries: vi.fn().mockResolvedValue(undefined),
  loadTimerState: vi.fn().mockResolvedValue(null),
  saveTimerState: vi.fn().mockResolvedValue(undefined)
}));

import './calculator-section';
import { CalculatorSection } from './calculator-section';

describe('CalculatorSection Component', () => {
  let el: CalculatorSection;

  beforeEach(() => {
    el = document.createElement('calculator-section') as CalculatorSection;
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  it('should load initial saved entries from storage and display correctly', async () => {
    // Wait for the async IndexedDB loading promise inside connectedCallback to resolve
    await new Promise(resolve => setTimeout(resolve, 50));

    const totalDisplay = el.shadowRoot?.getElementById('total-time-display');
    const entriesContainer = el.shadowRoot?.getElementById('entries-list');

    // Loaded 1 entry of 10 minutes (PT10M)
    expect(totalDisplay?.textContent).toBe('00h 10m 00s');

    const items = entriesContainer?.querySelectorAll('time-entry');
    expect(items?.length).toBe(1);
    expect((items?.[0] as any).description).toBe('Existing note');
  });

  it('should calculate new total when manual duration entry is added', async () => {
    await new Promise(resolve => setTimeout(resolve, 50));

    const calcH = el.shadowRoot?.getElementById('calc-h') as HTMLInputElement;
    const calcM = el.shadowRoot?.getElementById('calc-m') as HTMLInputElement;
    const calcS = el.shadowRoot?.getElementById('calc-s') as HTMLInputElement;
    const addBtn = el.shadowRoot?.getElementById('add-entry-btn')!;
    const totalDisplay = el.shadowRoot?.getElementById('total-time-display');

    // Add manual 1h 55m 20s
    calcH.value = '1';
    calcM.value = '55';
    calcS.value = '20';

    addBtn.dispatchEvent(new Event('click'));

    // Total should be: 10m (initial) + 1h 55m 20s = 2h 05m 20s
    expect(totalDisplay?.textContent).toBe('02h 05m 20s');
  });

  it('should update total when an entry remove event is triggered', async () => {
    await new Promise(resolve => setTimeout(resolve, 50));

    const totalDisplay = el.shadowRoot?.getElementById('total-time-display');
    const entriesContainer = el.shadowRoot?.getElementById('entries-list')!;

    // Dispatch remove-entry from the existing entry (id: '1')
    const removeEvent = new CustomEvent('remove-entry', {
      detail: { id: '1' },
      bubbles: true,
      composed: true
    });
    entriesContainer.dispatchEvent(removeEvent);

    // Total should drop to 0
    expect(totalDisplay?.textContent).toBe('00h 00m 00s');
  });
});
