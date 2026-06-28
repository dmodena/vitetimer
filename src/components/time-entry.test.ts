import { describe, it, expect, vi } from 'vitest';
import './time-entry';
import { TimeEntry } from './time-entry';

describe('TimeEntry Component', () => {
  const createComponent = (id: string, durationObj: any, desc: string = '') => {
    const el = document.createElement('time-entry') as TimeEntry;
    el.entryId = id;
    el.duration = (globalThis as any).Temporal.Duration.from(durationObj);
    el.description = desc;
    document.body.appendChild(el);
    return el;
  };

  it('should render formatted time duration correctly', () => {
    const el = createComponent('1', { hours: 1, minutes: 23, seconds: 45 });
    const display = el.shadowRoot?.getElementById('time-display');
    expect(display?.textContent).toBe('01h 23m 45s');
    el.remove();
  });

  it('should change note icon visual classes based on description content', () => {
    // Case 1: Empty description (should be outlined / gray)
    const el = createComponent('2', { minutes: 10 }, '');
    const noteBtn = el.shadowRoot?.getElementById('note-btn');
    const noteIcon = el.shadowRoot?.getElementById('note-icon');

    expect(noteIcon?.style.fontVariationSettings).toContain("'FILL' 0");
    expect(noteBtn?.className).toContain('text-outline/50');

    // Case 2: Present description (should be filled / primary colored)
    el.description = 'Working on task unit tests';
    expect(noteIcon?.style.fontVariationSettings).toContain("'FILL' 1");
    expect(noteBtn?.className).toContain('text-primary');

    el.remove();
  });

  it('should dispatch update-description custom event on save note click', () => {
    const el = createComponent('3', { minutes: 5 }, '');
    const modal = el.shadowRoot?.getElementById('desc-modal') as HTMLDialogElement;
    const descInput = el.shadowRoot?.getElementById('desc-input') as HTMLTextAreaElement;
    const saveBtn = el.shadowRoot?.getElementById('save-desc-btn')!;

    const eventListener = vi.fn();
    el.addEventListener('update-description', eventListener);

    // Mock open modal and type description
    modal.showModal();
    descInput.value = '   A new trimmed note   ';

    saveBtn.dispatchEvent(new Event('click'));

    expect(el.description).toBe('A new trimmed note');
    expect(eventListener).toHaveBeenCalledTimes(1);
    expect(eventListener.mock.calls[0][0].detail).toEqual({
      id: '3',
      description: 'A new trimmed note'
    });
    expect(modal.open).toBe(false);

    el.remove();
  });
});
