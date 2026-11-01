import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { AppLink, BrandMark, Button, Eyebrow, Text } from './Primitives';
import styles from './Layout.module.css';
import { LandingHeader } from './LandingHeader';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const { pathname } = useLocation();
  return pathname.startsWith('/projects/') ? <InnerHeader /> : <LandingHeader key={pathname} />;
}

function InnerHeader() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => setMenuOpen(false), [pathname]);
  const nav = <>
    <AppLink to="/projects" aria-current={pathname.startsWith('/projects') ? 'page' : undefined}>Selected work <ArrowUpRight size={11} /></AppLink>
    <AppLink to="/about" aria-current={pathname === '/about' ? 'page' : undefined}>The designer</AppLink>
    <AppLink to="/#contact" variant="outline" onClick={() => setMenuOpen(false)}>Let’s talk <ArrowUpRight size={15} /></AppLink>
  </>;
  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${pathname !== '/' ? styles.innerHeader : ''}`}>
      <AppLink to="/" className={styles.logo} aria-label="Vihita Khurana — home">
        <BrandMark tone="ink" />
        <span><strong>VIHITA</strong><span>KHURANA</span></span>
      </AppLink>
      <Eyebrow className={styles.headerNote}>A considered space.<br />A personal feeling.</Eyebrow>
      <nav className={styles.desktopNav} aria-label="Main navigation">{nav}</nav>
      <ThemeToggle paper className={styles.themeToggle} />
      <Button variant="quiet" className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>{menuOpen ? <X /> : <Menu />}</Button>
      {menuOpen && <nav id="mobile-menu" className={styles.mobileMenu} aria-label="Mobile navigation">{nav}<Text>Come in. Make yourself at home.</Text></nav>}
    </header>
  );
}
