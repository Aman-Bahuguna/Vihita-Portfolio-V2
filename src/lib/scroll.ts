export const ROOM_SCROLL_EVENT = 'room:scroll';

export function requestRoomScroll(target: string | number) {
  const event = new CustomEvent<string | number>(ROOM_SCROLL_EVENT, { detail: target, cancelable: true });
  if (!window.dispatchEvent(event)) return;
  const behavior = document.documentElement.dataset.motion === 'reduced' || typeof target === 'number' ? 'instant' : 'smooth';
  if (typeof target === 'number') window.scrollTo({ top: target, behavior });
  else document.getElementById(target.replace(/^#/, ''))?.scrollIntoView({ behavior, block: 'start' });
}
