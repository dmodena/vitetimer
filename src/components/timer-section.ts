import globalStyles from '../index.css?inline';
import templateContent from './timer-section.html?raw';
import { saveTimerState, loadTimerState } from '../utils/storage';

interface TimerState {
  hh: string;
  mm: string;
  ss: string;
  ms: string;
  [key: string]: string;
}

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

  private state = new Proxy<TimerState>(
    { hh: '00', mm: '00', ss: '00', ms: '0' },
    {
      set: (obj, prop, value) => {
        if (typeof prop === 'string') {
          obj[prop] = value;
        }

        if (this.timerMainEl && this.timerFractionEl) {
          this.timerMainEl.textContent = `${obj.hh}h ${obj.mm}m ${obj.ss}s`;
          this.timerFractionEl.textContent = obj.ms;
        }

        return true;
      }
    }
  );

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = `
      <style>${globalStyles}</style>
      ${templateContent}
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

    // Load saved timer state from IndexedDB
    loadTimerState()
      .then(savedState => {
        if (savedState && !this.isRunning) {
          this.pausedDuration = (globalThis as any).Temporal.Duration.from(savedState);
          this.renderTime(this.pausedDuration);
          this.sendToCalcBtnEl.disabled = false;
          this.sendToCalcBtnEl.classList.remove('opacity-50', 'cursor-not-allowed');
        }
      })
      .catch(err => console.error('Failed to load timer state:', err));
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

    // Save timer state to storage
    saveTimerState(this.pausedDuration.toString()).catch(err => console.error(err));

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

    // Clear saved timer state from storage
    saveTimerState(null).catch(err => console.error(err));

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

    this.state.hh = this.pad(d.hours);
    this.state.mm = this.pad(d.minutes);
    this.state.ss = this.pad(d.seconds);
    this.state.ms = this.head(d.milliseconds);
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
