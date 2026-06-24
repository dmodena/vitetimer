import globalStyles from '../index.css?inline';

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
      <section class="glass-card rounded-2xl p-lg space-y-lg" id="calculator-section">
        <header class="flex items-center justify-between">
          <h2 class="font-headline-lg text-lg text-on-surface">Time Calculator</h2>
          <span class="material-symbols-outlined text-outline" data-icon="calculate">calculate</span>
        </header>

        <!-- Input Row -->
        <div class="grid grid-cols-4 gap-sm items-end">
          <div class="space-y-xs">
            <label class="font-label-caps text-[11px] text-outline ml-1">HH</label>
            <input type="number" id="calc-h" placeholder="00" class="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 text-center font-body-md py-sm rounded-2xl" />
          </div>
          <div class="space-y-xs">
            <label class="font-label-caps text-[11px] text-outline ml-1">MM</label>
            <input type="number" id="calc-m" placeholder="00" class="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 text-center font-body-md py-sm rounded-2xl" />
          </div>
          <div class="space-y-xs">
            <label class="font-label-caps text-[11px] text-outline ml-1">SS</label>
            <input type="number" id="calc-s" placeholder="00" class="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 text-center font-body-md py-sm rounded-2xl" />
          </div>
          <button id="add-entry-btn" class="h-[40px] w-full bg-surface-tint text-on-primary rounded-2xl flex items-center justify-center hover:brightness-110 active:scale-95 transition-all">
            <span class="material-symbols-outlined" data-icon="add">add</span>
          </button>
        </div>

        <!-- List of Manual Entries -->
        <div id="entries-list" class="max-h-64 overflow-y-auto space-y-sm pr-xs custom-scrollbar">
          <!-- Empty state -->
          <div id="empty-entries" class="py-lg text-center text-outline/60 italic font-body-md">
            No entries added yet
          </div>
        </div>

        <!-- Footer: Total Time -->
        <footer class="pt-md border-t border-outline-variant flex items-center justify-between">
          <span class="font-label-caps text-xs text-outline">TOTAL DURATION</span>
          <div class="text-right">
            <span id="total-time-display" class="font-display-timer text-2xl text-primary">00h 00m 00s</span>
          </div>
        </footer>
      </section>
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
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 7);
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
