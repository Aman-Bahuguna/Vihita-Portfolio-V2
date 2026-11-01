import { useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useInView } from 'motion/react';
import { useMotionSettings } from '../../hooks/useMotionSettings';
import styles from './TextReveal.module.css';

export function TextReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const root = useRef<HTMLSpanElement>(null);
  const visible = useInView(root, { once: true });
  const { reducedMotion } = useMotionSettings();
  return <span className={styles.mask} ref={root}><motion.span initial={reducedMotion ? false : { y: '110%' }} animate={visible || reducedMotion ? { y: 0 } : undefined} transition={{ duration: reducedMotion ? 0 : 1.15, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.span></span>;
}
