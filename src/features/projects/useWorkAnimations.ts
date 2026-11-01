import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionSettings } from '../../hooks/useMotionSettings';

gsap.registerPlugin(ScrollTrigger);

export function useWorkAnimations(root: RefObject<HTMLElement | null>, category: string, expanded: boolean) {
  const { reducedMotion } = useMotionSettings();

  useLayoutEffect(() => {
    if (!root.current || reducedMotion) return;
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-collection-line]').forEach((line) => {
        gsap.from(line, { yPercent: 110, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: line.parentElement, start: 'top 92%', once: true } });
      });
      gsap.utils.toArray<HTMLElement>('[data-collection-reveal]').forEach((element) => {
        gsap.from(element, { y: 22, opacity: 0, duration: 0.75, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 95%', once: true } });
      });
      // Reveal the card without scaling or cropping the render.
      gsap.utils.toArray<HTMLElement>('[data-project-card]').forEach((card, index) => {
        const media = card.querySelector('[data-card-media]');
        const info = card.querySelector('[data-card-info]');
        gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: card, start: 'top 96%', once: true } })
          .from(media, { y: 24, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' })
          .from(info, { y: 12, opacity: 0, duration: 0.6 }, 0.15 + (index % 2) * 0.07);
      });
    }, root);
    // ScrollManager owns layout refreshes; image loads must not each refresh every trigger.
    return () => context.revert();
  }, [root, category, expanded, reducedMotion]);

  useLayoutEffect(() => {
    const nav = root.current?.querySelector<HTMLElement>('[data-work-categories]');
    const indicator = nav?.querySelector<HTMLElement>('[data-work-indicator]');
    if (!nav || !indicator) return;
    let initialized = false;
    // Playbook 117: preserve the underline's position between category changes.
    const context = gsap.context((self) => {
      const update = () => self.add(() => {
        const active = nav.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
        if (!active) return;
        gsap.to(indicator, { x: active.offsetLeft, scaleX: active.offsetWidth, duration: initialized && !reducedMotion ? 0.45 : 0, ease: 'power3.out', overwrite: true });
        initialized = true;
      });
      update();
      const resize = new ResizeObserver(update);
      const selection = new MutationObserver(update);
      resize.observe(nav);
      selection.observe(nav, { subtree: true, attributes: true, attributeFilter: ['aria-pressed'] });
      return () => { resize.disconnect(); selection.disconnect(); };
    }, root);
    return () => context.revert();
  }, [root, reducedMotion]);
}
