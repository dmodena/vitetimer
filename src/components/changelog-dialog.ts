import globalStyles from '../index.css?inline';
import templateContent from './changelog-dialog.html?raw';
import changelogContent from '../../CHANGELOG.md?raw';

interface ChangelogState {
  version: string;
  [key: string]: string;
}

export class ChangelogDialog extends HTMLElement {
  private versionBtnEl!: HTMLElement;

  private state = new Proxy<ChangelogState>(
    { version: '' },
    {
      set: (obj, prop, value) => {
        if (typeof prop === 'string') {
          obj[prop] = value;
        }

        if (prop === 'version') {
          if (this.versionBtnEl) this.versionBtnEl.textContent = value;
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
    const version = this.getAttribute('version') || 'v1.0.0';

    this.shadowRoot!.innerHTML = `
      <style>
        ${globalStyles}
        :host {
          display: contents;
        }
      </style>
      ${templateContent}
    `;

    this.versionBtnEl = this.shadowRoot!.getElementById('version-btn')!;
    const modal = this.shadowRoot!.getElementById('changelog-modal') as HTMLDialogElement;
    const closeBtn = this.shadowRoot!.getElementById('close-changelog-btn')!;
    const contentArea = this.shadowRoot!.getElementById('changelog-content')!;

    // Set version text dynamically using Proxy state
    this.state.version = version;

    // Set raw changelog text
    contentArea.textContent = changelogContent;

    // Set dialog actions
    this.versionBtnEl.addEventListener('click', () => {
      modal.showModal();
    });

    closeBtn.addEventListener('click', () => {
      modal.close();
    });
  }
}

if (!customElements.get('changelog-dialog')) {
  customElements.define('changelog-dialog', ChangelogDialog);
}
