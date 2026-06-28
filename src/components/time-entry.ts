import globalStyles from '../index.css?inline';
import templateContent from './time-entry.html?raw';

export class TimeEntry extends HTMLElement {
  private _duration: any;
  private _entryId: string = '';
  private _description: string = '';

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

  set description(desc: string) {
    this._description = desc || '';
    this.updateNoteIconState();
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

  private updateNoteIconState() {
    const noteIcon = this.shadowRoot?.getElementById('note-icon');
    const noteBtn = this.shadowRoot?.getElementById('note-btn');
    if (!noteIcon || !noteBtn) return;

    if (this._description) {
      noteIcon.style.fontVariationSettings = "'FILL' 1, 'wght' 400";
      noteBtn.className = "w-10 h-10 flex items-center justify-center text-primary rounded-full transition-colors";
    } else {
      noteIcon.style.fontVariationSettings = "'FILL' 0, 'wght' 400";
      noteBtn.className = "w-10 h-10 flex items-center justify-center text-outline/50 hover:text-primary rounded-full transition-colors";
    }
  }

  private render() {
    if (!this._duration) return;

    this.shadowRoot!.innerHTML = `
      <style>
        ${globalStyles}
        dialog::backdrop {
          background-color: rgba(31, 27, 23, 0.4);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
      </style>
      ${templateContent}
    `;

    this.shadowRoot!.getElementById('time-display')!.textContent = this.formatTime(this._duration);

    const noteBtn = this.shadowRoot!.getElementById('note-btn')!;
    const deleteBtn = this.shadowRoot!.getElementById('delete-btn')!;
    const modal = this.shadowRoot!.getElementById('desc-modal') as HTMLDialogElement;
    const saveBtn = this.shadowRoot!.getElementById('save-desc-btn')!;
    const descInput = this.shadowRoot!.getElementById('desc-input') as HTMLTextAreaElement;

    // Load initial input value
    descInput.value = this._description;

    this.updateNoteIconState();

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
    noteBtn.addEventListener('click', () => {
      descInput.value = this._description;
      modal.showModal();
    });

    // Save description note
    saveBtn.addEventListener('click', () => {
      const trimmedValue = descInput.value.trim();
      this._description = trimmedValue;
      this.updateNoteIconState();

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
