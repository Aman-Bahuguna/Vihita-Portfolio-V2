export const CURSOR_LAYER_EVENT = 'vihita:cursor-layer';

export function setCursorLayer(container: HTMLElement | null) {
  window.dispatchEvent(new CustomEvent(CURSOR_LAYER_EVENT, { detail: container }));
}
