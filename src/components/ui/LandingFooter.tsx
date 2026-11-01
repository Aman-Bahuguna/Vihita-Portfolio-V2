import { useLayoutEffect, useRef } from 'react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { designer } from '../../data/designer';
import { requestRoomScroll } from '../../lib/scroll';
import { AppLink, BrandMark, Button, Container, ExternalLink, Text } from './Primitives';
import styles from './LandingChrome.module.css';

gsap.registerPlugin(ScrollTrigger);

export function LandingFooter() {
  const root = useRef<HTMLElement>(null);
  const circle = useRef<SVGCircleElement>(null);
  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const length = 2 * Math.PI * 24;
      gsap.fromTo(circle.current, { strokeDasharray: length, strokeDashoffset: length }, {
        strokeDashoffset: 0, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true, invalidateOnRefresh: true },
      });
    }, root);
    return () => context.revert();
  }, []);
  return <footer ref={root} className={styles.footer}>
    <Container>
      <div className={styles.footerTop}><AppLink to="/" className={styles.brand} aria-label="Vihita Khurana, home"><BrandMark /><span>Vihita Khurana</span></AppLink><div className={styles.footerLinks}><AppLink to="/projects">Selected work <ArrowUpRight size={14} /></AppLink><AppLink to="/about">The designer <ArrowUpRight size={14} /></AppLink><ExternalLink href={designer.resume} target="_blank" rel="noreferrer">Résumé <ArrowUpRight size={14} /></ExternalLink></div><Button variant="icon" className={styles.backTop} onClick={() => requestRoomScroll(0)} aria-label="Back to top"><svg viewBox="0 0 56 56" fill="none" aria-hidden="true"><circle cx="28" cy="28" r="24" className={styles.progressTrack} /><circle ref={circle} cx="28" cy="28" r="24" className={styles.progressFill} /></svg><ArrowUp size={21} /></Button></div>
      <div className={styles.footerName} aria-hidden="true">A POINT OF VIEW.</div>
      <div className={styles.footerBottom}><Text>© {new Date().getFullYear()} Vihita Khurana</Text><AppLink to="/sitemap">Site map <ArrowUpRight size={12} /></AppLink><Text>Interior architectural designer</Text><Text>Jaipur, India</Text></div>
    </Container>
  </footer>;
}
