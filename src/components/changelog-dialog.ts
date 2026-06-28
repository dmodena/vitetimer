import globalStyles from '../index.css?inline';
import templateContent from './changelog-dialog.html?raw';
import changelogContent from '../../CHANGELOG.md?raw';

export class ChangelogDialog extends HTMLElement {
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

    const versionBtn = this.shadowRoot!.getElementById('version-btn')!;
    const modal = this.shadowRoot!.getElementById('changelog-modal') as HTMLDialogElement;
    const closeBtn = this.shadowRoot!.getElementById('close-changelog-btn')!;
    const contentArea = this.shadowRoot!.getElementById('changelog-content')!;

    // Set version text dynamically
    versionBtn.textContent = version;

    // Set raw changelog text
    contentArea.textContent = changelogContent;

    // Set dialog actions
    versionBtn.addEventListener('click', () => {
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
