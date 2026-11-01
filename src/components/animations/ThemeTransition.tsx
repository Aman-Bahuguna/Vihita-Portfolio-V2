import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import styles from './ThemeTransition.module.css';

const ARCH = 'M-1 2V0a1 1 0 0 1 2 0v2Z';
const COLOR_TOKENS = [
  '--primary', '--sage-mid', '--sage-dark', '--landing-bg', '--landing-panel',
  '--landing-panel-raised', '--landing-text', '--landing-muted', '--landing-line',
  '--landing-accent-text', '--landing-paper', '--room-stage', '--room-stage-line',
  '--footer-bg', '--footer-panel', '--footer-text', '--footer-muted', '--footer-line',
];
const REVEAL_PROPERTIES = ['--theme-origin-x', '--theme-origin-y', '--theme-line-x', '--theme-line-y', '--theme-line-scale', '--theme-line-opacity'];

export interface ThemeTransitionHandle {
  play: (theme: 'light' | 'dark', origin: { x: number; y: number }, onChange: () => void) => Promise<void>;
  finish: () => void;
}

export const ThemeTransition = forwardRef<ThemeTransitionHandle>(function ThemeTransition(_, ref) {
  const root = useRef<HTMLDivElement>(null);
  const clip = useRef<SVGPathElement>(null);
  const drawing = useRef<SVGGElement>(null);
  const finish = useRef<(() => void) | null>(null);

  useImperativeHandle(ref, () => ({
    finish: () => finish.current?.(),
    play: (theme, origin, onChange) => {
      finish.current?.();
      const screen = root.current;
      if (!screen || !clip.current || !drawing.current) { onChange(); return Promise.resolve(); }
      const html = document.documentElement;
      const initialSize = 18;
      const finalSize = Math.hypot(Math.max(origin.x, innerWidth - origin.x), Math.max(origin.y, innerHeight - origin.y)) + 40;
      const transform = (size: number, x = origin.x, y = origin.y) => `translate(${x} ${y}) rotate(-12) scale(${size})`;
      const oldColors = Object.fromEntries(COLOR_TOKENS.map((token) => [token, getComputedStyle(html).getPropertyValue(token).trim()]));
      const oldInline = COLOR_TOKENS.map((token) => [token, html.style.getPropertyValue(token), html.style.getPropertyPriority(token)]);
      clip.current.setAttribute('transform', transform(initialSize));
      drawing.current.setAttribute('transform', transform(initialSize));
      screen.dataset.destination = theme;
      screen.hidden = false;
      html.style.setProperty('--theme-origin-x', `${origin.x}px`);
      html.style.setProperty('--theme-origin-y', `${origin.y}px`);
      html.style.setProperty('--theme-line-x', '0px');
      html.style.setProperty('--theme-line-y', '0px');
      html.style.setProperty('--theme-line-scale', '1');
      html.style.setProperty('--theme-line-opacity', '1');

      return new Promise<void>((resolve) => {
        let changed = false;
        let stopped = false;
        let fallback = false;
        let transition: ReturnType<Document['startViewTransition']> | undefined;
        let clock: Animation | undefined;
        let timeline: gsap.core.Timeline | undefined;
        const change = () => {
          if (changed) return;
          changed = true;
          onChange();
        };
        finish.current = () => {
          if (stopped) return;
          stopped = true;
          timeline?.kill();
          clock?.cancel();
          transition?.skipTransition();
          change();
          screen.hidden = true;
          screen.style.removeProperty('opacity');
          REVEAL_PROPERTIES.forEach((property) => html.style.removeProperty(property));
          if (fallback) oldInline.forEach(([token, value, priority]) => {
            if (value) html.style.setProperty(token, value, priority);
            else html.style.removeProperty(token);
          });
          finish.current = null;
          resolve();
        };

        const animate = (colors?: Record<string, string>) => {
          const progress = { value: 0 };
          timeline = gsap.timeline({
            onComplete: () => {
              clock?.cancel();
              if (transition) void transition.finished.then(() => finish.current?.(), () => finish.current?.());
              else finish.current?.();
            },
          });
          timeline.to(progress, {
            value: 1, duration: 0.95, ease: 'power2.inOut',
            onUpdate: () => {
              const size = initialSize + (finalSize - initialSize) * progress.value;
              const travel = 1 - (1 - Math.min(1, progress.value * 3)) ** 3;
              const x = origin.x + (innerWidth / 2 - origin.x) * travel;
              const y = origin.y + (innerHeight * 0.38 - origin.y) * travel;
              const opacity = Math.max(0, 1 - progress.value * 3);
              clip.current?.setAttribute('transform', transform(size, x, y));
              if (fallback) {
                drawing.current?.setAttribute('transform', transform(size, x, y));
                screen.style.opacity = `${opacity}`;
              } else {
                html.style.setProperty('--theme-line-x', `${x - origin.x}px`);
                html.style.setProperty('--theme-line-y', `${y - origin.y}px`);
                html.style.setProperty('--theme-line-scale', `${size / initialSize}`);
                html.style.setProperty('--theme-line-opacity', `${opacity}`);
              }
            },
          }, 0);
          if (colors) timeline.to(html, { ...colors, duration: 0.95, ease: 'power2.inOut' }, 0);
        };

        const blend = () => {
          fallback = true;
          change();
          const colors = Object.fromEntries(COLOR_TOKENS.map((token) => [token, getComputedStyle(html).getPropertyValue(token).trim()]));
          COLOR_TOKENS.forEach((token) => html.style.setProperty(token, oldColors[token]));
          animate(colors);
        };

        const start = async () => {
          if (typeof document.startViewTransition !== 'function') { blend(); return; }
          try {
            transition = document.startViewTransition(change);
            void transition.finished.catch(() => undefined);
            await transition.ready;
          } catch {
            transition?.skipTransition();
            transition = undefined;
            if (!stopped) blend();
            return;
          }
          if (stopped) return;
          // Keep the snapshots alive while the live SVG clip path grows.
          clock = html.animate({ opacity: [1, 1] }, { duration: 1400, pseudoElement: '::view-transition-new(root)' });
          void clock.finished.catch(() => undefined);
          animate();
        };
        void start().catch(() => finish.current?.());
      });
    },
  }), []);

  useEffect(() => () => finish.current?.(), []);

  return createPortal(
    <div ref={root} className={styles.screen} hidden aria-hidden="true" data-theme-screen>
      <svg className={styles.drawing} fill="none">
        <defs><clipPath id="theme-arch-clip" clipPathUnits="userSpaceOnUse"><path ref={clip} d={ARCH} /></clipPath></defs>
        <g ref={drawing} className={styles.arch} data-theme-arch>
          <path d={ARCH} vectorEffect="non-scaling-stroke" />
          <path d="M-.72 2V0a.72 .72 0 0 1 1.44 0v2M-1.2 2h2.4" vectorEffect="non-scaling-stroke" opacity=".45" />
        </g>
      </svg>
    </div>,
    document.body,
  );
});
