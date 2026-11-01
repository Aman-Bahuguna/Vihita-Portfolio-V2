import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronUp, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { AppLink, Button, Container, Eyebrow, FloorPlan, Heading, Text } from './Primitives';
import styles from './Layout.module.css';
import landing from './LandingChrome.module.css';
import perspective from './PerspectiveNavigation.module.css';

const rooms = [
  { id: 'entrance', name: 'Overview', short: 'Overview', number: '01', note: 'A point of view' },
  { id: 'studio', name: 'Expertise', short: 'Expertise', number: '02', note: 'Skills & software' },
  { id: 'gallery', name: 'Selected work', short: 'Work', number: '03', note: 'Explore the projects' },
  { id: 'contact', name: 'Contact', short: 'Contact', number: '04', note: 'Start a conversation' },
];

export function RoomNavigation({ inline = false }: { inline?: boolean }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('entrance');
  const { pathname } = useLocation();
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (pathname !== '/') return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-20% 0px -40% 0px' });
    rooms.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('mousedown', close);
    window.addEventListener('keydown', escape);
    return () => { window.removeEventListener('mousedown', close); window.removeEventListener('keydown', escape); };
  }, [open]);
  const current = rooms.find((room) => room.id === active) ?? rooms[0];
  if (inline) return <section className={perspective.section} aria-labelledby="perspective-title">
    <Container className={perspective.layout}>
      <div className={perspective.intro}>
        <Eyebrow className={perspective.kicker}><FloorPlan /> A guide to this space</Eyebrow>
        <Heading id="perspective-title" className={perspective.title}>Find your<br />perspective<span>.</span></Heading>
        <Text className={perspective.description}>Every space starts with a point of view. Step into mine — from the first idea to the final detail.</Text>
        <Text className={perspective.hint}><span aria-hidden="true" /> Choose a room. Explore at your pace.</Text>
      </div>
      <div className={perspective.blueprint}>
        <div className={perspective.planLabel}><Eyebrow>The portfolio / An open plan</Eyebrow><span aria-hidden="true">01 — 04</span></div>
        <nav className={perspective.grid} aria-label="Explore the portfolio">
          {rooms.map((room) => <AppLink key={room.id} to={`/#${room.id}`} className={perspective.room}>
            <span className={perspective.roomTop}><span>{room.number} /</span><ArrowUpRight aria-hidden="true" /></span>
            <span className={perspective.roomName}>{room.name}</span>
            <span className={perspective.roomNote}>{room.note}</span>
          </AppLink>)}
        </nav>
        <div className={perspective.planLabel}><span>Four rooms. One point of view.</span><FloorPlan /></div>
      </div>
    </Container>
  </section>;
  // The landing page exposes the plan in the page instead of hiding it in a popover.
  if (pathname === '/') return null;
  return (
    <div className={`${styles.roomNavigation} ${!pathname.startsWith('/projects/') ? landing.navigation : ''}`} ref={root}>
      {open && <div className={styles.floorplanPopover} id="floorplan">
        <div className={styles.planHeading}><Eyebrow>The portfolio</Eyebrow><Button variant="quiet" onClick={() => setOpen(false)} aria-label="Close floor plan"><X size={15} /></Button></div>
        <Text className={styles.planIntro}>Find your perspective.</Text>
        <nav className={styles.planGrid} aria-label="Room navigation">
          {rooms.map((room) => <AppLink key={room.id} to={`/#${room.id}`} className={`${styles.planRoom} ${active === room.id && pathname === '/' ? styles.planRoomActive : ''}`} aria-current={active === room.id && pathname === '/' ? 'location' : undefined} onClick={() => setOpen(false)}><span><ArrowUpRight size={13} /></span><strong>{room.name}</strong><small>{room.note}</small></AppLink>)}
        </nav>
        <Eyebrow className={styles.planFootnote}>Jump to a section. Explore at your pace.</Eyebrow>
      </div>}
      <Button variant="quiet" className={styles.roomToggle} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="floorplan" aria-label={`Open floor plan. Current room: ${pathname === '/' ? current.short : 'Exploring'}`}>
        <FloorPlan />
        <span className={styles.currentRoom}>{pathname === '/' ? current.short : 'Floor plan'}</span>
        <span className={styles.roomDots} aria-hidden="true">{rooms.map(({ id }) => <i key={id} className={id === active && pathname === '/' ? styles.activeDot : ''} data-active={id === active && pathname === '/' ? 'true' : undefined} />)}</span>
        <ChevronUp size={13} className={open ? styles.chevronOpen : ''} />
      </Button>
    </div>
  );
}
