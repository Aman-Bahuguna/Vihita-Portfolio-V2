import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heading, Text } from '../ui/Primitives';
import { useMotionSettings } from '../../hooks/useMotionSettings';
import styles from './SpatialStory.module.css';

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);
export function SpatialStory() {
  const root = useRef<HTMLElement>(null);
  const { reducedMotion } = useMotionSettings();
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const context = gsap.context(() => {
      const path = root.current!.querySelector<SVGPathElement>('[data-plan]')!;
      const length = path.getTotalLength();
      const media = gsap.matchMedia();
      media.add({ desktop: '(min-width: 800px) and (hover: hover) and (pointer: fine)', all: 'all' }, (match) => {
        const desktop = match.conditions?.desktop;
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.set('[data-pencil]', { autoAlpha: 1 });
        const timeline = gsap.timeline({
          scrollTrigger: desktop
            ? { trigger: root.current, start: 'top top', end: '+=1400', scrub: 0.8, pin: true, invalidateOnRefresh: true }
            : { trigger: '[data-plan-art]', start: 'top 90%', end: 'bottom 55%', scrub: 0.35, invalidateOnRefresh: true },
        });
        timeline.to(path, { strokeDashoffset: 0, duration: 3, ease: 'none' }, 0)
          .to('[data-pencil]', { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: true }, duration: 3, ease: 'none' }, 0)
          .to('[data-plan-art]', { rotate: desktop ? -8 : -2, scale: desktop ? 1.15 : 1.02, duration: 3 }, 0)
          .to('[data-shape]', { attr: { d: 'M170 280 L170 200 Q170 100 270 100 L330 100 Q430 100 430 200 L430 280 Z' }, duration: 1 }, 2)
          .from('[data-story-image]', { clipPath: 'inset(100% 0 0 0)', scale: desktop ? 1.2 : 1.05, duration: 1.5 }, 1.5);
        if (desktop) {
          timeline.fromTo('[data-story-word]', { opacity: 0.16 }, { opacity: 1, stagger: 0.4, duration: 0.6 }, 0);
        } else {
          gsap.from('[data-story-word]', { opacity: 0.2, stagger: 0.08, duration: 0.5, scrollTrigger: { trigger: '[data-story-copy]', start: 'top 80%', once: true } });
        }
      });
      return () => media.revert();
    }, root);
    return () => context.revert();
  }, [reducedMotion]);
  return <section className={styles.story} ref={root}>
    <div className={styles.copy} data-story-copy><Text>Inside the process</Text><Heading>{['An', 'idea.', 'A', 'line.', 'A', 'place', 'to', 'belong.'].map((word, i) => <span data-story-word key={i}>{word} </span>)}</Heading><Text>Space planning, material exploration, and the small decisions that change everything.</Text></div>
    <div className={styles.art} data-plan-art>
      <svg viewBox="0 0 600 420" fill="none" aria-label="A floor plan drawn into a spatial concept">
        <path data-plan d="M70 350V65H530V350H70M270 65V175H70M270 240V350M270 205H415V65M415 270H530M320 270H370V320H320V270M110 220H210V300H110V220" stroke="currentColor" strokeWidth="2" />
        <path data-shape d="M170 280 L170 180 Q170 180 170 180 L430 180 Q430 180 430 180 L430 280 Z" fill="currentColor" opacity=".12" />
        <g data-pencil><path d="M-25 -4H16L27 0L16 4H-25Z" fill="#20211f" /><path d="M16 -4L27 0L16 4Z" fill="#f3f0e7" /></g>
      </svg>
      <img data-story-image src="/assets/dc-bond-office-02-thumb.webp" alt="A developed executive office visualization" width="680" height="560" loading="lazy" />
    </div>
  </section>;
}
