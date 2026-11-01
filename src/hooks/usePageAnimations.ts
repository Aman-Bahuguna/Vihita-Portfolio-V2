import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionSettings } from './useMotionSettings';

gsap.registerPlugin(ScrollTrigger);

export function usePageAnimations(root: RefObject<HTMLElement | null>) {
  const { reducedMotion } = useMotionSettings();
  useLayoutEffect(() => {
    if (reducedMotion || !root.current) return;
    const cleanups: Array<() => void> = [];
    const context = gsap.context(() => {
      ScrollTrigger.batch('[data-project-card]:not([data-gallery-card])', {
        start: 'top 95%',
        onEnter: (elements) => gsap.fromTo(elements, { y: 55, clipPath: 'inset(12% 0 0 0)' }, { y: 0, clipPath: 'inset(0% 0 0 0)', stagger: 0.12, duration: 0.9, overwrite: 'auto' }),
      });
      root.current!.querySelectorAll<HTMLElement>('a[data-magnetic]').forEach((element) => {
        const x = gsap.quickTo(element, 'x', { duration: 0.45, ease: 'power3.out' });
        const y = gsap.quickTo(element, 'y', { duration: 0.45, ease: 'power3.out' });
        const move = (event: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          x((event.clientX - rect.left - rect.width / 2) * 0.18);
          y((event.clientY - rect.top - rect.height / 2) * 0.18);
        };
        const reset = () => { x(0); y(0); };
        element.addEventListener('mousemove', move);
        element.addEventListener('mouseleave', reset);
        cleanups.push(() => { element.removeEventListener('mousemove', move); element.removeEventListener('mouseleave', reset); });
      });
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.fromTo(element, { y: 35, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 94%', once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((element) => {
        gsap.fromTo(element, { yPercent: -5, scale: 1.08 }, {
          yPercent: 5, scale: 1.08, ease: 'none',
          scrollTrigger: { trigger: element.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
      gsap.utils.toArray<SVGPathElement>('[data-draw]').forEach((path) => {
        const length = path.getTotalLength();
        gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, {
          strokeDashoffset: 0, ease: 'none',
          scrollTrigger: { trigger: path.closest('section'), start: 'top 70%', end: 'bottom 80%', scrub: 0.5 },
        });
      });
    }, root);
    return () => { cleanups.forEach((cleanup) => cleanup()); context.revert(); };
  }, [root, reducedMotion]);
}
