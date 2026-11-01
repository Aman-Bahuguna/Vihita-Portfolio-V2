import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMotionSettings } from '../../hooks/useMotionSettings';
import { CURSOR_LAYER_EVENT } from '../../lib/cursor';
import styles from './CustomCursor.module.css';

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const follower = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [container, setContainer] = useState<HTMLElement>(document.body);
  const { reducedMotion } = useMotionSettings();
  useEffect(() => {
    // Move into a modal's top layer only when it opens or closes, not on DOM mutations.
    const changeLayer = (event: Event) => setContainer((event as CustomEvent<HTMLElement | null>).detail ?? document.body);
    window.addEventListener(CURSOR_LAYER_EVENT, changeLayer);
    setContainer(document.querySelector<HTMLDialogElement>('dialog[open]') ?? document.body);
    return () => window.removeEventListener(CURSOR_LAYER_EVENT, changeLayer);
  }, []);
  useEffect(() => {
    const cursor = ref.current;
    const trail = follower.current;
    if (reducedMotion || !cursor || !trail) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const html = document.documentElement;
    let frame = 0;
    let visible = false;
    let target: Element | null = null;
    let x = 0;
    let y = 0;
    let followX = 0;
    let followY = 0;
    let lastTime = 0;
    let lastX = Number.NaN;
    let lastY = Number.NaN;
    let currentLabel = '';
    const hide = () => {
      if (visible) {
        cursor.dataset.visible = 'false';
        delete html.dataset.customCursor;
      }
      visible = false;
      lastTime = 0;
      window.cancelAnimationFrame(frame);
      frame = 0;
    };
    const draw = (time: number) => {
      frame = 0;
      if (document.hidden || target?.closest('input, textarea, select, [contenteditable], iframe, [data-native-cursor]')) { hide(); return; }
      if (!visible) {
        followX = x;
        followY = y;
        cursor.dataset.visible = 'true';
        html.dataset.customCursor = 'true';
        visible = true;
      }
      const interactive = String(Boolean(target?.closest('a, button:not(:disabled), [role="button"], [data-cursor]')));
      if (cursor.dataset.interactive !== interactive) cursor.dataset.interactive = interactive;
      const nextLabel = target?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? '';
      if (nextLabel !== currentLabel) {
        if (label.current) label.current.textContent = nextLabel;
        cursor.dataset.labeled = String(Boolean(nextLabel));
        currentLabel = nextLabel;
      }
      // The point stays precise; only its halo eases behind. Stop scheduling when settled.
      const blend = 1 - Math.exp(-Math.min(lastTime ? time - lastTime : 16.7, 50) / 55);
      followX += (x - followX) * blend;
      followY += (y - followY) * blend;
      lastTime = time;
      if (x !== lastX || y !== lastY) {
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        lastX = x;
        lastY = y;
      }
      trail.style.transform = `translate3d(${followX - x}px, ${followY - y}px, 0)`;
      if (Math.abs(x - followX) + Math.abs(y - followY) > 0.15) frame = window.requestAnimationFrame(draw);
    };
    const move = (event: PointerEvent) => {
      if (!fine.matches || event.pointerType !== 'mouse') { hide(); return; }
      target = event.target instanceof Element ? event.target : null;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(draw);
    };
    const press = () => { cursor.dataset.pressed = 'true'; };
    const release = () => { cursor.dataset.pressed = 'false'; };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', press, { passive: true });
    window.addEventListener('pointerup', release, { passive: true });
    window.addEventListener('blur', hide);
    document.addEventListener('pointerleave', hide);
    document.addEventListener('visibilitychange', hide);
    fine.addEventListener('change', hide);
    return () => {
      hide();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('blur', hide);
      document.removeEventListener('pointerleave', hide);
      document.removeEventListener('visibilitychange', hide);
      fine.removeEventListener('change', hide);
    };
  }, [reducedMotion, container]);
  return createPortal(
    <div ref={ref} className={styles.cursor} aria-hidden="true" data-cursor-layer>
      <span className={styles.point} />
      <div ref={follower} className={styles.follower}>
        <span className={styles.halo} />
        <span ref={label} className={styles.label} />
      </div>
    </div>,
    container,
  );
}
