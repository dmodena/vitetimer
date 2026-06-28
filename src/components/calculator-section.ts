import globalStyles from '../index.css?inline';
import templateContent from './calculator-section.html?raw';

export class CalculatorSection extends HTMLElement {
  private entries: { id: string; duration: any }[] = [];

  private calcHEl!: HTMLInputElement;
  private calcMEl!: HTMLInputElement;
  private calcSEl!: HTMLInputElement;
  private addEntryBtn!: HTMLButtonElement;
  private entriesListEl!: HTMLElement;
  private emptyEntriesEl!: HTMLElement;
  private totalTimeDisplay!: HTMLElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = `
      <style>${globalStyles}</style>
      ${templateContent}
    `;

    this.calcHEl = this.shadowRoot!.getElementById('calc-h') as HTMLInputElement;
    this.calcMEl = this.shadowRoot!.getElementById('calc-m') as HTMLInputElement;
    this.calcSEl = this.shadowRoot!.getElementById('calc-s') as HTMLInputElement;
    this.addEntryBtn = this.shadowRoot!.getElementById('add-entry-btn') as HTMLButtonElement;
    this.entriesListEl = this.shadowRoot!.getElementById('entries-list')!;
    this.emptyEntriesEl = this.shadowRoot!.getElementById('empty-entries')!;
    this.totalTimeDisplay = this.shadowRoot!.getElementById('total-time-display')!;

    this.addEntryBtn.addEventListener('click', () => this.addManualEntry());

    // Listen to global events
    document.addEventListener('time-sent', (e: Event) => this.handleTimeSent(e as CustomEvent));

    // Listen to remove events from within shadow dom
    this.shadowRoot!.addEventListener('remove-entry', (e: Event) => this.removeEntry(e as CustomEvent));
  }

  private handleTimeSent(e: CustomEvent) {
    const duration = e.detail.duration;
    if (duration) {
      this.addEntry(duration);
    }
  }

  private addManualEntry() {
    const h = parseInt(this.calcHEl.value) || 0;
    const m = parseInt(this.calcMEl.value) || 0;
    const s = parseInt(this.calcSEl.value) || 0;

    if (h === 0 && m === 0 && s === 0) return;

    const duration = (globalThis as any).Temporal.Duration.from({ hours: h, minutes: m, seconds: s });
    this.addEntry(duration);

    this.calcHEl.value = '';
    this.calcMEl.value = '';
    this.calcSEl.value = '';
  }

  private addEntry(duration: any) {
    const id = (globalThis as any).crypto.randomUUID();
    this.entries.push({ id, duration });
    this.renderEntries();
    this.updateTotal();
  }

  private removeEntry(e: CustomEvent) {
    const idToRemove = e.detail.id;
    this.entries = this.entries.filter(entry => entry.id !== idToRemove);
    this.renderEntries();
    this.updateTotal();
  }

  private renderEntries() {
    // Clear list except the empty state
    Array.from(this.entriesListEl.children).forEach(child => {
      if (child.id !== 'empty-entries') {
        child.remove();
      }
    });

    if (this.entries.length === 0) {
      this.emptyEntriesEl.style.display = 'block';
    } else {
      this.emptyEntriesEl.style.display = 'none';
      this.entries.forEach(entry => {
        const timeEntryEl = document.createElement('time-entry') as any;
        timeEntryEl.entryId = entry.id;
        timeEntryEl.duration = entry.duration;
        this.entriesListEl.appendChild(timeEntryEl);
      });
    }
  }

  private updateTotal() {
    // Calculate total using Temporal Duration sum by seconds
    let totalSeconds = 0;
    this.entries.forEach(entry => {
      totalSeconds += entry.duration.total({ unit: 'second' });
    });

    const totalDuration = (globalThis as any).Temporal.Duration.from({ seconds: totalSeconds }).round({ largestUnit: 'hour' });

    const hh = totalDuration.hours.toString().padStart(2, '0');
    const mm = totalDuration.minutes.toString().padStart(2, '0');
    const ss = totalDuration.seconds.toString().padStart(2, '0');

    this.totalTimeDisplay.textContent = `${hh}h ${mm}m ${ss}s`;
  }
}

if (!customElements.get('calculator-section')) {
  customElements.define('calculator-section', CalculatorSection);
}
