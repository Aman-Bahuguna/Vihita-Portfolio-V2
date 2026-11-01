import { animate, motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useLayoutEffect, useRef, useState } from 'react';
import { Move, RotateCcw } from 'lucide-react';
import { designer } from '../../data/designer';
import { useMotionSettings } from '../../hooks/useMotionSettings';
import { Button, DoorMark, Eyebrow, Text } from '../../components/ui/Primitives';
import styles from './About.module.css';

export function HangingCard() {
  const { reducedMotion } = useMotionSettings();
  const board = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState({ width: 400, height: 600, cardHeight: 400, cardTop: 110, pegY: 16 });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotation = useTransform(x, [-120, 0, 120], [-12, 0, 12]);
  const rotate = useSpring(rotation, { stiffness: 180, damping: 17 });
  useLayoutEffect(() => {
    const measure = () => {
      if (!board.current || !card.current) return;
      const height = board.current.clientHeight;
      const cardHeight = card.current.offsetHeight;
      const padding = Number.parseFloat(getComputedStyle(board.current).paddingTop);
      const peg = board.current.firstElementChild as HTMLElement;
      setGeometry({ width: board.current.clientWidth, height, cardHeight, cardTop: (height + padding - cardHeight) / 2 - 7, pegY: peg.offsetTop + peg.offsetHeight / 2 });
    };
    const observer = new ResizeObserver(measure);
    if (board.current) observer.observe(board.current);
    if (card.current) observer.observe(card.current);
    measure();
    return () => observer.disconnect();
  }, []);
  const cord = useTransform([x, y, rotate], ([horizontal, vertical, angle]) => {
    const radians = (reducedMotion ? 0 : Number(angle)) * Math.PI / 180;
    const arm = geometry.cardHeight / 2 + 7;
    const endX = geometry.width / 2 + Number(horizontal) + Math.sin(radians) * arm;
    const endY = geometry.cardTop + Number(vertical) + (1 - Math.cos(radians)) * arm;
    return `M ${geometry.width / 2} ${geometry.pegY} Q ${geometry.width / 2} ${(geometry.pegY + endY) / 2} ${endX} ${endY}`;
  });
  const reset = () => {
    void animate(x, 0, { type: 'spring', stiffness: 230, damping: 19, duration: reducedMotion ? 0 : undefined });
    void animate(y, 0, { type: 'spring', stiffness: 230, damping: 19, duration: reducedMotion ? 0 : undefined });
  };
  return <div className={styles.cardBoard} ref={board}>
    <div className={styles.cardPeg} aria-hidden="true" />
    <svg className={styles.cordDrawing} viewBox={`0 0 ${geometry.width} ${geometry.height}`} aria-hidden="true"><motion.path d={cord} fill="none" stroke="currentColor" strokeWidth="0.8" /></svg>
    <motion.div
      ref={card}
      className={styles.hangingCard}
      style={{ x, y, rotate: reducedMotion ? 0 : rotate }}
      drag
      dragSnapToOrigin
      dragElastic={0.2}
      dragConstraints={{ left: -85, right: 85, top: -30, bottom: 65 }}
      dragTransition={{ bounceStiffness: 230, bounceDamping: 19 }}
      tabIndex={0}
      role="group"
      aria-label="Draggable designer card. Use arrow keys to move, Escape to reset."
      onKeyDown={(event) => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) event.preventDefault();
        if (event.key === 'ArrowLeft') x.set(Math.max(-85, x.get() - 15));
        if (event.key === 'ArrowRight') x.set(Math.min(85, x.get() + 15));
        if (event.key === 'ArrowUp') y.set(Math.max(-30, y.get() - 15));
        if (event.key === 'ArrowDown') y.set(Math.min(65, y.get() + 15));
        if (event.key === 'Escape') reset();
      }}
      data-cursor="Pull"
    >
      <div className={styles.cardClip} aria-hidden="true" />
      <div className={styles.cardTop}><DoorMark /><Eyebrow>A study in curiosity</Eyebrow></div>
      <img src={designer.headshot} alt="Vihita Khurana" width="1086" height="1448" loading="lazy" draggable={false} />
      <div className={styles.cardDetails}><Text>Vihita Khurana</Text><Eyebrow>Interior architectural designer</Eyebrow><span><span>Jaipur, India</span><span>Always looking closer.</span></span></div>
    </motion.div>
    <div className={styles.cardInstructions}><Text><Move size={12} /> A little less screen. A little more tangible.</Text><Button variant="quiet" onClick={reset} aria-label="Reset hanging card"><RotateCcw size={12} /></Button></div>
  </div>;
}
