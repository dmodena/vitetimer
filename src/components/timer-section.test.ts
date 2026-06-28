import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock DB storage calls before loading the timer code
vi.mock('../utils/storage', () => ({
  loadTimerState: vi.fn().mockResolvedValue(null),
  saveTimerState: vi.fn().mockResolvedValue(undefined)
}));

import './timer-section';
import { TimerSection } from './timer-section';

describe('TimerSection Component', () => {
  let el: TimerSection;

  beforeEach(() => {
    el = document.createElement('timer-section') as TimerSection;
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  it('should initialize with paused state and 00h 00m 00s display', async () => {
    await new Promise(resolve => setTimeout(resolve, 10));

    const timerMain = el.shadowRoot?.getElementById('timer-main');
    const playIcon = el.shadowRoot?.getElementById('play-icon');
    const pauseIcon = el.shadowRoot?.getElementById('pause-icon');

    expect(timerMain?.textContent).toBe('00h 00m 00s');
    expect(playIcon?.classList.contains('hidden')).toBe(false);
    expect(pauseIcon?.classList.contains('hidden')).toBe(true);
  });

  it('should toggle playing state when play button is clicked', async () => {
    await new Promise(resolve => setTimeout(resolve, 10));

    const playPauseBtn = el.shadowRoot?.getElementById('play-pause-btn')!;
    const playIcon = el.shadowRoot?.getElementById('play-icon');
    const pauseIcon = el.shadowRoot?.getElementById('pause-icon');

    // Click to start
    playPauseBtn.dispatchEvent(new Event('click'));
    expect(playIcon?.classList.contains('hidden')).toBe(true);
    expect(pauseIcon?.classList.contains('hidden')).toBe(false);

    // Click to pause
    playPauseBtn.dispatchEvent(new Event('click'));
    expect(playIcon?.classList.contains('hidden')).toBe(false);
    expect(pauseIcon?.classList.contains('hidden')).toBe(true);
  });

  it('should increment timer text display when running using virtual clock', async () => {
    await new Promise(resolve => setTimeout(resolve, 10));

    vi.useFakeTimers();
    const playPauseBtn = el.shadowRoot?.getElementById('play-pause-btn')!;
    const timerMain = el.shadowRoot?.getElementById('timer-main');

    // Click to start
    playPauseBtn.dispatchEvent(new Event('click'));

    // Fast-forward 5500 milliseconds (5.5 seconds)
    vi.advanceTimersByTime(5500);

    expect(timerMain?.textContent).toBe('00h 00m 05s');

    vi.useRealTimers();
  });

  it('should dispatch time-sent custom event on document when export button is clicked', async () => {
    await new Promise(resolve => setTimeout(resolve, 10));

    const sendToCalcBtn = el.shadowRoot?.getElementById('send-to-calc-btn') as HTMLButtonElement;

    // Manually configure paused duration and enable button to isolate the export test
    (el as any).pausedDuration = (globalThis as any).Temporal.Duration.from({ seconds: 10 });
    sendToCalcBtn.disabled = false;

    const eventListener = vi.fn();
    document.addEventListener('time-sent', eventListener);

    // Click export button
    sendToCalcBtn.dispatchEvent(new Event('click'));

    expect(eventListener).toHaveBeenCalledTimes(1);
    expect(eventListener.mock.calls[0][0].detail.duration.seconds).toBe(10);

    document.removeEventListener('time-sent', eventListener);
  });
});
