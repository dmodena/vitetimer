import globalStyles from '../index.css?inline';
import templateContent from './time-entry.html?raw';

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
      ${templateContent}
    `;

    this.shadowRoot!.getElementById('time-display')!.textContent = this.formatTime(this._duration);

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
