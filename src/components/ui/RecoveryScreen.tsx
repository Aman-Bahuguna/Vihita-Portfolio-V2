import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useEffect } from 'react';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Container, ExternalLink, Eyebrow, Heading, Text } from './Primitives';
import styles from './RecoveryScreen.module.css';

export function RecoveryScreen({ error = false }: { error?: boolean }) {
  usePageTitle(error ? 'A pause in the plan' : 'Page not found');
  useEffect(() => {
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, follow';
    document.head.append(robots);
    return () => robots.remove();
  }, []);
  return (
    <section className={styles.screen} aria-labelledby="recovery-title">
      <Container className={styles.layout}>
        <div className={styles.drawing} aria-hidden="true">
          <div className={styles.dimension}><span />{error ? 'A SMALL INTERRUPTION' : 'ROOM NOT FOUND'}<span /></div>
          <div className={styles.number}>
            <span>{error ? '—' : '4'}</span>
            <svg viewBox="0 0 120 180" fill="none">
              <path className={styles.construction} d="M60 0v180M0 166h120M18 170V66a42 42 0 0 1 84 0v104" />
              <path className={styles.arch} d="M26 164V66a34 34 0 0 1 68 0v98M34 164V66a26 26 0 0 1 52 0v98M12 164h96" />
              <path className={styles.door} d="M35 164V66q0-25 25-26v111Z" />
              <path className={styles.arch} d="M53 103v10" />
            </svg>
            <span>{error ? '—' : '4'}</span>
          </div>
          <div className={styles.caption}><span>THE PORTFOLIO</span><span>AN OPEN DOOR, ALWAYS.</span></div>
        </div>
        <div className={styles.copy}>
          <Eyebrow className={styles.kicker}>{error ? 'Something went off-plan' : 'A small detour / 404'}</Eyebrow>
          <Heading as="h1" id="recovery-title">{error ? <>A pause.<br />Not a dead end.</> : <>A little lost?<br />Come on home.</>}</Heading>
          <Text>{error ? 'This space couldn’t load properly. Let’s take you back to the entrance and start fresh.' : 'This room isn’t on the floor plan. The address may have changed, but there’s still plenty to explore.'}</Text>
          <ExternalLink href="/" variant="solid" className={styles.home}><ArrowLeft size={17} />Back to the entrance</ExternalLink>
          <nav className={styles.links} aria-label="Find your way">
            <ExternalLink href="/projects">Selected work <ArrowUpRight size={14} /></ExternalLink>
            <ExternalLink href="/sitemap">View the site map <ArrowUpRight size={14} /></ExternalLink>
          </nav>
        </div>
      </Container>
    </section>
  );
}
