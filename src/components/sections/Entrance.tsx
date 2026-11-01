import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Sun, Moon } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionSettings } from '../../hooks/useMotionSettings';
import { AppLink, Button, Heading, Text } from '../ui/Primitives';
import { SceneBoundary } from '../ui/SceneBoundary';
import { RoomPoster } from '../three/RoomPoster';
import type { RoomAtmosphere } from '../three/RoomStudy';
import styles from './Entrance.module.css';

const RoomStudy = lazy(() => import('../three/RoomStudy'));
gsap.registerPlugin(ScrollTrigger);
const materials: { name: string; atmosphere: RoomAtmosphere }[] = [
  { name: 'Natural', atmosphere: 'natural' },
  { name: 'Warm', atmosphere: 'warm' },
  { name: 'Cool', atmosphere: 'cool' },
];

export function Entrance() {
  const root = useRef<HTMLElement>(null);
  const [material, setMaterial] = useState(0);
  const [evening, setEvening] = useState(false);
  const [loadRoom, setLoadRoom] = useState(false);
  const { reducedMotion } = useMotionSettings();
  useEffect(() => {
    let idle: number | undefined;
    let timer: number | undefined;
    const cancel = () => {
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) window.clearTimeout(timer);
    };
    // Keep model decoding/GPU setup out of the entrance animation; cancel if scrolled away.
    const observer = new IntersectionObserver(([entry]) => {
      cancel();
      if (!entry.isIntersecting) return;
      timer = window.setTimeout(() => {
        const load = () => { observer.disconnect(); setLoadRoom(true); };
        if (typeof window.requestIdleCallback === 'function') {
          idle = window.requestIdleCallback(load, { timeout: 1200 });
        } else load();
      }, 1600);
    });
    if (root.current) observer.observe(root.current);
    return () => {
      observer.disconnect();
      cancel();
    };
  }, []);
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const context = gsap.context(() => {
      gsap.from('[data-hero-line]', { yPercent: 110, stagger: 0.13, duration: 1.2, ease: 'power4.out' });
      gsap.from('[data-room]', { clipPath: 'inset(0 100% 0 0)', duration: 1.5, ease: 'power3.inOut' });
      gsap.to('[data-room]', { scale: 1.12, yPercent: -7, scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('[data-hero-name]', { xPercent: -12, opacity: 0.15, scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
    }, root);
    return () => context.revert();
  }, [reducedMotion]);
  return <section id="entrance" ref={root} className={styles.hero}>
    <div className={styles.intro}><Text>Vihita Khurana<br />Interior architectural designer</Text><Text>Independent perspective.<br />Jaipur, India.</Text></div>
    <Heading as="h1" className={styles.title} data-hero-name><span><span data-hero-line>NOT JUST</span></span><span><span data-hero-line>A SPACE<span className={styles.period}>.</span></span></span></Heading>
    <div className={styles.stage} data-room>
      <div className={styles.stageTop}><Text>Make yourself at home.</Text><Button variant="quiet" onClick={() => setEvening(!evening)} aria-label="Change room lighting" aria-pressed={evening}>{evening ? <Moon /> : <Sun />} {evening ? 'Evening' : 'Daylight'}</Button></div>
      <SceneBoundary fallback={<RoomPoster />}>{loadRoom ? <Suspense fallback={<RoomPoster />}><RoomStudy atmosphere={materials[material].atmosphere} reducedMotion={reducedMotion} evening={evening} /></Suspense> : <RoomPoster />}</SceneBoundary>
      <div className={styles.materials} role="group" aria-label="Change the atmosphere"><Text>Atmosphere</Text><div>{materials.map((item, index) => <Button key={item.name} variant="quiet" className={`${styles.swatch} ${styles[`swatch${index}`]}`} onClick={() => setMaterial(index)} aria-label={`${item.name} lighting`} title={`${item.name} lighting`} aria-pressed={material === index}>{index === material && <Check size={12} />}</Button>)}</div><Text className="sr-only" aria-live="polite">{materials[material].name}</Text></div>
      <span className={styles.coordinate}>A tiny room, fully considered. Move to explore.</span>
    </div>
    <div className={styles.bottom}><div><Heading as="h2">A point of view.</Heading><Text>I design the spaces around us.<br />And the way we feel within them.</Text></div><AppLink to="/projects" className={styles.work} data-magnetic>See my work <ArrowUpRight /></AppLink></div>
  </section>;
}
