import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { selectedProjects } from '../../data/projects';
import { useMotionSettings } from '../../hooks/useMotionSettings';
import { ProjectCard } from '../../features/projects/ProjectCard';
import { requestRoomScroll } from '../../lib/scroll';
import { AppLink, Button, Container, Heading, Text } from '../ui/Primitives';
import styles from './Home.module.css';

gsap.registerPlugin(ScrollTrigger);

export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const pin = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const { reducedMotion } = useMotionSettings();

  useLayoutEffect(() => {
    setActive(0);
    if (viewport.current) viewport.current.scrollLeft = 0;
    if (reducedMotion || !root.current || !track.current) return;
    let alive = true;
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add('(min-width: 1050px)', () => {
        if (viewport.current) viewport.current.scrollLeft = 0;
        const distance = () => Math.max(0, track.current!.scrollWidth - window.innerWidth + window.innerWidth * 0.055);
        const timeline = gsap.timeline({
          scrollTrigger: {
            id: 'landing-gallery',
            trigger: root.current, start: 'top top', end: () => `+=${distance()}`,
            pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
            onUpdate: (self) => { if (alive) setActive(Math.min(selectedProjects.length - 1, Math.round(self.progress * (selectedProjects.length - 1)))); },
          },
        });
        timeline.to(track.current, { x: () => -distance(), ease: 'none', duration: 1 }, 0)
          .fromTo(progress.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1 }, 0);
        pin.current = timeline.scrollTrigger ?? null;
        return () => {
          pin.current = null;
          if (alive) {
            setActive(0);
            if (viewport.current) viewport.current.scrollLeft = 0;
          }
        };
      });
      media.add('(max-width: 1049px)', () => {
        gsap.from(viewport.current, { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: viewport.current, start: 'top 94%', once: true } });
        gsap.utils.toArray<HTMLElement>('[data-card-media] > img').forEach((image) => {
          gsap.fromTo(image, { xPercent: -3, scale: 1.06 }, {
            xPercent: 3, scale: 1.06, ease: 'none',
            scrollTrigger: { trigger: image.parentElement, scroller: viewport.current, horizontal: true, start: 'left right', end: 'right left', scrub: 0.3, invalidateOnRefresh: true },
          });
        });
      });
      return () => media.revert();
    }, root);
    return () => { alive = false; context.revert(); pin.current = null; };
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (reducedMotion || !counter.current) return;
    const context = gsap.context(() => {
      gsap.fromTo(counter.current, { yPercent: 65, opacity: 0.3 }, { yPercent: 0, opacity: 1, duration: 0.35, ease: 'power3.out' });
    }, counter);
    return () => context.revert();
  }, [active, reducedMotion]);

  const updateNativeProgress = () => {
    if (pin.current || !track.current || !viewport.current) return;
    const cards = Array.from(track.current.children) as HTMLElement[];
    const left = viewport.current.scrollLeft;
    const closest = cards.reduce((best, card, index) =>
      Math.abs(card.offsetLeft - track.current!.offsetLeft - left) < Math.abs(cards[best].offsetLeft - track.current!.offsetLeft - left) ? index : best, 0);
    setActive(closest);
    if (progress.current) {
      const distance = viewport.current.scrollWidth - viewport.current.clientWidth;
      progress.current.style.transform = `scaleX(${distance > 0 ? left / distance : 1})`;
    }
  };

  const browse = (direction: number) => {
    const target = Math.max(0, Math.min(selectedProjects.length - 1, active + direction));
    if (pin.current) {
      requestRoomScroll(pin.current.start + (target / (selectedProjects.length - 1)) * (pin.current.end - pin.current.start));
    } else if (viewport.current && track.current) {
      const card = track.current.children[target] as HTMLElement | undefined;
      if (card) viewport.current.scrollTo({ left: card.offsetLeft - track.current.offsetLeft, behavior: reducedMotion ? 'instant' : 'smooth' });
    }
  };

  return <section id="gallery" className={`${styles.gallery} ${reducedMotion ? styles.galleryReduced : ''}`} ref={root}>
    <Container className={styles.galleryHeading}>
      <div><Text className={styles.sectionKicker}>Selected work / A curated perspective</Text><Heading className={styles.galleryTitle}>LESS TALK.<br /><span>MORE SPACES.</span></Heading></div>
      <div className={styles.galleryIntro}><Text>Residential renovations. Workplaces. The details in between.</Text><AppLink to="/projects" className={styles.textLink}>All projects <ArrowUpRight size={20} /></AppLink></div>
    </Container>
    <div className={styles.galleryEdition} aria-hidden="true"><span>THE SPATIAL EDIT</span><span>Ideas made tangible / {String(active + 1).padStart(2, '0')}</span></div>
    <div className={styles.galleryViewport} ref={viewport} data-lenis-prevent-horizontal onScroll={updateNativeProgress}>
      <div className={styles.galleryTrack} ref={track}>{selectedProjects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} gallery sharedLayout={false} className={styles.homeProject} />)}</div>
    </div>
    <Container className={styles.galleryBottom}>
      <div className={styles.galleryCounter} aria-live="polite"><span ref={counter}>{String(active + 1).padStart(2, '0')}</span><span>/ {String(selectedProjects.length).padStart(2, '0')}</span></div>
      <div className={styles.galleryProgress} aria-hidden="true"><span ref={progress} /></div>
      <div className={styles.galleryArrows}><Button variant="icon" onClick={() => browse(-1)} disabled={active === 0} aria-label="Previous project"><ArrowLeft /></Button><Button variant="icon" onClick={() => browse(1)} disabled={active === selectedProjects.length - 1} aria-label="Next project"><ArrowRight /></Button></div>
    </Container>
  </section>;
}
