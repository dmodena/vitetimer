import globalStyles from '../index.css?inline';

export class TimeEntry extends HTMLElement {
  private _duration: any;
  private _entryId: string = '';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set entryId(id: string) {
    this._entryId = id;
  }

  get entryId() {
    return this._entryId;
  }

  set duration(duration: any) {
    this._duration = duration;
    this.render();
  }

  get duration() {
    return this._duration;
  }

  private formatTime(duration: any) {
    const hh = duration.hours.toString().padStart(2, '0');
    const mm = duration.minutes.toString().padStart(2, '0');
    const ss = duration.seconds.toString().padStart(2, '0');
    return `${hh}h ${mm}m ${ss}s`;
  }

  private render() {
    if (!this._duration) return;
    
    this.shadowRoot!.innerHTML = `
      <style>${globalStyles}</style>
      <div class="flex items-center justify-between p-sm px-md bg-surface-container-low rounded-2xl border border-outline-variant/30 hover:border-primary/30 transition-colors">
        <span class="font-display-timer text-lg font-semibold text-on-surface">${this.formatTime(this._duration)}</span>
        <button id="delete-btn" class="w-10 h-10 flex items-center justify-center text-error hover:bg-error-container rounded-full transition-colors">
          <span class="material-symbols-outlined" data-icon="delete">delete</span>
        </button>
      </div>
    `;

    this.shadowRoot!.getElementById('delete-btn')!.addEventListener('click', () => {
      const removeEvent = new CustomEvent('remove-entry', {
        detail: { id: this._entryId },
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(removeEvent);
    });
  }
}

if (!customElements.get('time-entry')) {
  customElements.define('time-entry', TimeEntry);
}
