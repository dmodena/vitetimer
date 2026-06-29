import globalStyles from '../index.css?inline';
import templateContent from './time-entry.html?raw';

const NOTE_ICON_FILLED_VARIATION = "'FILL' 1, 'wght' 400";
const NOTE_ICON_OUTLINED_VARIATION = "'FILL' 0, 'wght' 400";

const NOTE_BUTTON_FILLED_CLASS = "w-10 h-10 flex items-center justify-center text-primary rounded-full transition-colors";
const NOTE_BUTTON_OUTLINED_CLASS = "w-10 h-10 flex items-center justify-center text-outline/50 hover:text-primary rounded-full transition-colors";

interface TimeEntryState {
  timeString: string;
  description: string;
  [key: string]: string;
}

export class TimeEntry extends HTMLElement {
  private _duration: any;
  private _entryId: string = '';
  private _description: string = '';

  private timeDisplayEl!: HTMLElement;
  private noteIconEl!: HTMLElement;
  private noteBtnEl!: HTMLElement;
  private descInputEl!: HTMLTextAreaElement;

  private state = new Proxy<TimeEntryState>(
    { timeString: '', description: '' },
    {
      set: (obj, prop, value) => {
        if (typeof prop === 'string') {
          obj[prop] = value;
        }

        if (prop === 'timeString') {
          if (this.timeDisplayEl) this.timeDisplayEl.textContent = value;
        } else if (prop === 'description') {
          if (this.noteIconEl && this.noteBtnEl) {
            if (value) {
              this.noteIconEl.style.fontVariationSettings = NOTE_ICON_FILLED_VARIATION;
              this.noteBtnEl.className = NOTE_BUTTON_FILLED_CLASS;
            } else {
              this.noteIconEl.style.fontVariationSettings = NOTE_ICON_OUTLINED_VARIATION;
              this.noteBtnEl.className = NOTE_BUTTON_OUTLINED_CLASS;
            }
          }

          if (this.descInputEl && this.descInputEl.value !== value) {
            this.descInputEl.value = value;
          }
        }

        return true;
      }
    }
  );

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
    this.state.timeString = this.formatTime(duration);
  }

  get duration() {
    return this._duration;
  }

  set description(desc: string) {
    this._description = desc || '';
    this.state.description = this._description;
  }

  get description() {
    return this._description;
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
      <style>
        ${globalStyles}
        :host {
          display: block;
        }
        dialog::backdrop {
          background-color: rgba(31, 27, 23, 0.4);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
      </style>
      ${templateContent}
    `;

    // Map DOM element properties
    this.timeDisplayEl = this.shadowRoot!.getElementById('time-display')!;
    this.noteIconEl = this.shadowRoot!.getElementById('note-icon')!;
    this.noteBtnEl = this.shadowRoot!.getElementById('note-btn')!;
    this.descInputEl = this.shadowRoot!.getElementById('desc-input') as HTMLTextAreaElement;

    const deleteBtn = this.shadowRoot!.getElementById('delete-btn')!;
    const modal = this.shadowRoot!.getElementById('desc-modal') as HTMLDialogElement;
    const saveBtn = this.shadowRoot!.getElementById('save-desc-btn')!;

    // Initial state bindings (triggers the proxy traps)
    this.state.timeString = this.formatTime(this._duration);
    this.state.description = this._description;

    // Wire up delete
    deleteBtn.addEventListener('click', () => {
      const removeEvent = new CustomEvent('remove-entry', {
        detail: { id: this._entryId },
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(removeEvent);
    });

    // Open description modal
    this.noteBtnEl.addEventListener('click', () => {
      this.descInputEl.value = this._description;
      modal.showModal();
    });

    // Save description note
    saveBtn.addEventListener('click', () => {
      const trimmedValue = this.descInputEl.value.trim();
      this._description = trimmedValue;
      this.state.description = trimmedValue;

      // Dispatch event to allow parent (calculator-section) to save updated list
      const updateEvent = new CustomEvent('update-description', {
        detail: { id: this._entryId, description: this._description },
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(updateEvent);
      modal.close();
    });
  }
}

if (!customElements.get('time-entry')) {
  customElements.define('time-entry', TimeEntry);
}
