import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useMotionSettings } from '../../hooks/useMotionSettings';
import styles from './Animations.module.css';

export function DoorTransition() {
  const { pathname } = useLocation();
  const { reducedMotion } = useMotionSettings();
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (reducedMotion || !ref.current) return;
    const context = gsap.context(() => {
      gsap.fromTo('[data-door]', { scaleY: 1 }, { scaleY: 0, duration: 0.65, ease: 'power3.inOut' });
    }, ref);
    return () => context.revert();
  }, [pathname, reducedMotion]);
  return <div ref={ref} className={styles.transition} aria-hidden="true"><div data-door /></div>;
}
