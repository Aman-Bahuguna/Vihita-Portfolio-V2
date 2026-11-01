import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useMotionSettings } from '../../hooks/useMotionSettings';
import { Button, Text } from '../ui/Primitives';
import styles from './Preloader.module.css';

export function Preloader() {
  const { reducedMotion } = useMotionSettings();
  const [visible, setVisible] = useState(() => {
    try { return !sessionStorage.getItem('vihita-entered'); } catch { return true; }
  });
  const finish = useCallback(() => {
    try { sessionStorage.setItem('vihita-entered', 'true'); } catch { /* Private browsing must not block entry. */ }
    setVisible(false);
  }, []);
  useEffect(() => {
    if (!visible) return;
    if (reducedMotion) {
      finish();
      return;
    }
    const timer = window.setTimeout(finish, 2300);
    return () => window.clearTimeout(timer);
  }, [visible, reducedMotion, finish]);
  return <AnimatePresence>{visible && !reducedMotion && <motion.div className={styles.loader}
    exit={{ clipPath: 'inset(50% 0 50% 0)' }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    aria-label="An architectural doorway opens into the portfolio">
    <div className={styles.top}><Text>VIHITA KHURANA</Text><Text>Spaces with soul.</Text></div>
    <div className={styles.perspective} aria-hidden="true">
      <div className={styles.room}>
        <div className={styles.back}><span>COME<br />ON IN.</span></div>
        <div className={styles.left} /><div className={styles.right} /><div className={styles.floor} />
        <div className={styles.door} />
      </div>
    </div>
    <div className={styles.bottom}><div><Text>A new perspective awaits.</Text><span className={styles.line} /></div><Button variant="quiet" onClick={finish}>Skip intro</Button></div>
  </motion.div>}</AnimatePresence>;
}
