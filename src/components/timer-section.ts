import globalStyles from '../index.css?inline';

export class TimerSection extends HTMLElement {
  private timerInterval: number | null = null;
  private isRunning: boolean = false;
  
  private initialTime: any;
  private pausedDuration: any;

  private timerMainEl!: HTMLElement;
  private timerFractionEl!: HTMLElement;
  private playIconEl!: HTMLElement;
  private pauseIconEl!: HTMLElement;
  private timerChipEl!: HTMLElement;
  private sendToCalcBtnEl!: HTMLButtonElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = `
      <style>${globalStyles}</style>
      <section class="flex flex-col items-center justify-center py-xl space-y-lg w-full">
        <div class="timer-display text-center">
          <div class="font-display-timer text-display-timer text-on-surface flex items-start justify-center">
            <span id="timer-main">00h 00m 00s</span>
            <span class="timer-fraction text-primary font-label-caps" id="timer-fraction">0</span>
          </div>
          <p class="font-label-caps text-xs text-outline tracking-widest mt-xs uppercase">Elapsed Time</p>
        </div>
        <div class="flex items-center gap-lg">
          <!-- Reset -->
          <button id="reset-btn" class="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-outline hover:bg-surface-container hover:text-primary transition-all active:scale-95">
            <span class="material-symbols-outlined" data-icon="replay">replay</span>
          </button>
          <!-- Play/Pause -->
          <button id="play-pause-btn" class="w-20 h-20 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-md hover:shadow-lg hover:brightness-105 active:scale-90 transition-all">
            <span id="play-icon" class="material-symbols-outlined text-[40px]" data-icon="play_arrow">play_arrow</span>
            <span id="pause-icon" class="material-symbols-outlined text-[40px] hidden" data-icon="pause">pause</span>
          </button>
          <!-- Send to Calculator -->
          <button id="send-to-calc-btn" disabled class="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-outline opacity-50 cursor-not-allowed hover:bg-surface-container hover:text-primary transition-all disabled:hover:bg-transparent">
            <span class="material-symbols-outlined" data-icon="input">input</span>
          </button>
        </div>
        <div class="h-6" id="status-label">
          <span id="timer-running-chip" class="font-label-caps text-[10px] text-primary px-3 py-1 bg-primary-fixed rounded-full hidden">TIMER ACTIVE</span>
        </div>
      </section>
    `;

    this.timerMainEl = this.shadowRoot!.getElementById('timer-main')!;
    this.timerFractionEl = this.shadowRoot!.getElementById('timer-fraction')!;
    this.playIconEl = this.shadowRoot!.getElementById('play-icon')!;
    this.pauseIconEl = this.shadowRoot!.getElementById('pause-icon')!;
    this.timerChipEl = this.shadowRoot!.getElementById('timer-running-chip')!;
    this.sendToCalcBtnEl = this.shadowRoot!.getElementById('send-to-calc-btn') as HTMLButtonElement;

    this.shadowRoot!.getElementById('play-pause-btn')!.addEventListener('click', () => this.toggleTimer());
    this.shadowRoot!.getElementById('reset-btn')!.addEventListener('click', () => this.resetTimer());
    this.sendToCalcBtnEl.addEventListener('click', () => this.sendToCalc());
  }

  disconnectedCallback() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private toggleTimer() {
    if (this.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  private startTimer() {
    if (this.isRunning) return;

    this.initialTime = (globalThis as any).Temporal.Now.instant();
    if (this.pausedDuration) {
      this.initialTime = this.initialTime.subtract(this.pausedDuration);
      this.pausedDuration = undefined;
    }

    this.isRunning = true;
    this.timerInterval = window.setInterval(() => this.updateDisplay(), 100) as unknown as number;

    this.playIconEl.classList.add('hidden');
    this.pauseIconEl.classList.remove('hidden');
    this.timerChipEl.classList.remove('hidden');
    
    this.sendToCalcBtnEl.disabled = true;
    this.sendToCalcBtnEl.classList.add('opacity-50', 'cursor-not-allowed');
  }

  private pauseTimer() {
    if (!this.isRunning) return;

    this.isRunning = false;
    clearInterval(this.timerInterval!);
    this.pausedDuration = (globalThis as any).Temporal.Now.instant().since(this.initialTime);

    this.playIconEl.classList.remove('hidden');
    this.pauseIconEl.classList.add('hidden');
    this.timerChipEl.classList.add('hidden');

    this.sendToCalcBtnEl.disabled = false;
    this.sendToCalcBtnEl.classList.remove('opacity-50', 'cursor-not-allowed');
  }

  private resetTimer() {
    this.isRunning = false;
    clearInterval(this.timerInterval!);
    this.pausedDuration = undefined;
    
    this.playIconEl.classList.remove('hidden');
    this.pauseIconEl.classList.add('hidden');
    this.timerChipEl.classList.add('hidden');

    this.sendToCalcBtnEl.disabled = true;
    this.sendToCalcBtnEl.classList.add('opacity-50', 'cursor-not-allowed');

    this.renderTime((globalThis as any).Temporal.Duration.from({ seconds: 0 }));
  }

  private updateDisplay() {
    if (!this.isRunning) return;
    const currentTime = (globalThis as any).Temporal.Now.instant();
    const duration = currentTime.since(this.initialTime);
    this.renderTime(duration);
  }

  private renderTime(duration: any) {
    const d = duration.round({ smallestUnit: 'millisecond', largestUnit: 'hour' });
    
    const hh = this.pad(d.hours);
    const mm = this.pad(d.minutes);
    const ss = this.pad(d.seconds);
    const ms = this.head(d.milliseconds);

    this.timerMainEl.textContent = `${hh}h ${mm}m ${ss}s`;
    this.timerFractionEl.textContent = ms;
  }

  private sendToCalc() {
    if (this.isRunning) return;
    if (!this.pausedDuration) return;

    // Send the rounded duration to the calculator
    const duration = this.pausedDuration.round({ smallestUnit: 'second', largestUnit: 'hour' });
    if (duration.total({ unit: 'second' }) === 0) return;

    const timeEvent = new CustomEvent('time-sent', {
      detail: { duration },
      bubbles: true,
      composed: true
    });

    this.dispatchEvent(timeEvent);
    this.resetTimer();
    
    const calcSection = document.querySelector('calculator-section');
    if (calcSection) calcSection.scrollIntoView({ behavior: 'smooth' });
  }

  private pad(n: number) {
    let s = n.toString();
    if (s.length < 2) s = '0' + s;
    return s;
  }

  private head(n: number) {
    let s = n.toString();
    return s.length > 0 ? s[0] : '0';
  }
}

if (!customElements.get('timer-section')) {
  customElements.define('timer-section', TimerSection);
}
