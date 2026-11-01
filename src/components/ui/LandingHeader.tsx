import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { designer } from '../../data/designer';
import { useMotionSettings } from '../../hooks/useMotionSettings';
import { AppLink, BrandMark, Button, ExternalLink, Text } from './Primitives';
import { ThemeToggle } from './ThemeToggle';
import styles from './LandingHeader.module.css';

gsap.registerPlugin(ScrollTrigger);

const links = [
  { label: 'Selected work', to: '/projects' },
  { label: 'The designer', to: '/about' },
];

export function LandingHeader() {
  const root = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { reducedMotion } = useMotionSettings();
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(progress.current, { scaleX: 0 }, {
        scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true, invalidateOnRefresh: true },
      });
    }, root);
    return () => { context.revert(); gsap.killTweensOf(marker.current); };
  }, []);
  useLayoutEffect(() => {
    if (!open || !menu.current) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    const panel = menu.current;
    document.body.style.overflow = 'hidden';
    const context = gsap.context(() => {
      if (!reducedMotion) {
        gsap.fromTo(menu.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' });
        gsap.from('[data-menu-link]', { y: 35, opacity: 0, stagger: 0.07, duration: 0.6, ease: 'power3.out' });
      }
    }, menu);
    menu.current.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
    return () => {
      gsap.killTweensOf(panel);
      context.revert();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [open, reducedMotion]);

  const indicate = (element: HTMLAnchorElement) => {
    gsap.to(marker.current, { x: element.offsetLeft, scaleX: element.offsetWidth, opacity: 1, duration: reducedMotion ? 0 : 0.35, ease: 'power3.out', overwrite: true });
  };
  const hideIndicator = () => { gsap.to(marker.current, { opacity: 0, duration: reducedMotion ? 0 : 0.2 }); };
  const closeMenu = () => {
    if (reducedMotion || !menu.current) { setOpen(false); return; }
    gsap.to(menu.current, { opacity: 0, y: -15, duration: 0.2, onComplete: () => setOpen(false), overwrite: true });
  };
  const handleMenuKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') { event.preventDefault(); closeMenu(); return; }
    if (event.key !== 'Tab' || !menu.current) return;
    const items = Array.from(menu.current.querySelectorAll<HTMLElement>('a, button'));
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  };

  return <header ref={root} className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
    <div className={styles.inner}>
      <AppLink to="/" className={styles.brand} aria-label="Vihita Khurana, home"><span className={styles.brandMark}><BrandMark /></span><span className={styles.wordmark}><strong>VIHITA</strong><span>KHURANA</span></span></AppLink>
      <nav className={styles.nav} aria-label="Main navigation" onMouseLeave={hideIndicator}>
        {links.map((item) => <AppLink key={item.to} to={item.to} onMouseEnter={(event) => indicate(event.currentTarget)} onFocus={(event) => indicate(event.currentTarget)} onBlur={hideIndicator} aria-label={item.label}><span className={styles.rollingText}><span>{item.label}</span><span aria-hidden="true">{item.label}</span></span></AppLink>)}
        <span className={styles.navMarker} ref={marker} aria-hidden="true" />
      </nav>
      <ThemeToggle className={styles.themeToggle} />
      <AppLink to="/#contact" className={styles.contactLink}><span>Let’s talk</span><span className={styles.linkArrow}><ArrowUpRight size={19} /><ArrowUpRight size={19} aria-hidden="true" /></span></AppLink>
      <Button variant="quiet" className={styles.menuToggle} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="landing-menu" onClick={() => open ? closeMenu() : setOpen(true)}>{open ? <X /> : <Menu />}</Button>
    </div>
    <span className={styles.pageProgress} ref={progress} aria-hidden="true" />
    {open && <div id="landing-menu" ref={menu} className={styles.menu} data-lenis-prevent role="dialog" aria-modal="true" aria-label="Navigation" onKeyDown={handleMenuKeys}>
      <nav aria-label="Mobile navigation">{links.map((item) => <AppLink key={item.to} to={item.to} onClick={() => setOpen(false)} data-menu-link>{item.label}<ArrowUpRight strokeWidth={1} /></AppLink>)}<AppLink to="/#contact" onClick={() => setOpen(false)} data-menu-link>Let’s talk<ArrowUpRight strokeWidth={1} /></AppLink></nav>
      <div className={styles.menuBottom}><Text>Interior architectural designer<br />Jaipur, India</Text><ExternalLink href={`mailto:${designer.email}`}>{designer.email}</ExternalLink><Button variant="quiet" onClick={closeMenu}>Close menu <X size={16} /></Button></div>
    </div>}
  </header>;
}
