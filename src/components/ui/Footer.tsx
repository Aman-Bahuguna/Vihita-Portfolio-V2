import { ArrowUpRight } from 'lucide-react';
import { designer } from '../../data/designer';
import { AppLink, BrandMark, Container, ExternalLink, Text } from './Primitives';
import styles from './Layout.module.css';
import { useLocation } from 'react-router-dom';
import { LandingFooter } from './LandingFooter';

export function Footer() {
  const { pathname } = useLocation();
  if (!pathname.startsWith('/projects/')) return <LandingFooter key={pathname} />;
  return (
    <footer className={styles.footer}>
      <Container className={styles.footerRow}>
        <AppLink to="/" className={styles.footerBrand}><BrandMark tone="ink" /><span>Thoughtfully, Vihita.</span></AppLink>
        <Text>© {new Date().getFullYear()} Vihita Khurana</Text>
        <div><ExternalLink href={designer.resume} target="_blank" rel="noreferrer">Résumé <ArrowUpRight size={13} /></ExternalLink><AppLink to="/about">A little about me <ArrowUpRight size={13} /></AppLink><AppLink to="/sitemap">Site map <ArrowUpRight size={13} /></AppLink></div>
      </Container>
    </footer>
  );
}
