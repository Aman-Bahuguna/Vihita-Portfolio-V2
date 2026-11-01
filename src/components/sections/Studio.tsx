import { useLayoutEffect, useRef } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { softwareTools } from '../../data/software';
import { useMotionSettings } from '../../hooks/useMotionSettings';
import { AppLink, Container, Heading, Text } from '../ui/Primitives';
import styles from './Studio.module.css';

gsap.registerPlugin(ScrollTrigger);
const disciplines = [
  { title: 'Plan with intention.', tag: '01 / THE FOUNDATION', description: 'Space planning and furniture layouts. Finding the right relationship between people, movement, and the room.', image: '/assets/abhishek-residence-01.webp', alt: 'Abhishek residence living-room render with a cream sofa, armchairs, and warm wood finishes', kind: 'render' },
  { title: 'Resolve the details.', tag: '02 / THE RESOLUTION', description: 'Material selection, elevations, and working drawings. Making the idea clear enough to carry through.', image: '/assets/vaibhav-soni-residence-01.webp', alt: 'Vaibhav Soni residence render with illuminated wall arches, decorative panels, and marble finishes', kind: 'render' },
  { title: 'See the possibility.', tag: '03 / THE ATMOSPHERE', description: '3D modelling and visualisation. Exploring light, texture, and atmosphere before the space takes shape.', image: '/assets/dc-bond-office-02.webp', alt: 'DC Bond executive office visualisation', kind: 'render' },
];

export function Studio() {
  const root = useRef<HTMLElement>(null);
  const { reducedMotion } = useMotionSettings();
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-process], [data-tool-card]').forEach((card) => {
        gsap.from(card, { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 94%', once: true } });
      });
    }, root);
    return () => context.revert();
  }, [reducedMotion]);
  return <section id="studio" className={styles.studio} ref={root}><Container>
    <div className={styles.sectionTop}><Text>Thought meets technique</Text><ArrowDownRight aria-hidden="true" /></div>
    <div className={styles.headingRow}><Heading className={styles.title}><span>CREATIVE EYE.</span><span>TECHNICAL MIND.</span></Heading><Text className={styles.intro}>Instinct starts the conversation. Precision makes it real. A little imagination, grounded in the way we live.</Text></div>
    <div className={styles.processGrid} data-process-grid>{disciplines.map(item => <article key={item.title} className={styles.processCard} data-process>
      <Text className={styles.processTag}>{item.tag}</Text>
      <div className={`${styles.processImage} ${item.kind === 'render' ? styles.processRender : ''}`}><img src={item.image} alt={item.alt} width={1200} height={900} loading="lazy" /></div>
      <Heading as="h3">{item.title}</Heading><Text>{item.description}</Text>
    </article>)}</div>
    <AppLink to="/projects?category=extra" className={styles.archiveLink}>Ideas, on paper. Explore the drawing archive <ArrowUpRight size={18} /></AppLink>
    <div id="toolkit" className={styles.toolkit}>
      <div className={styles.toolkitHeading}><Heading as="h3">THE TOOLS.<br /><span>THE POSSIBILITIES.</span></Heading><Text>Not just software. An idea-to-reality toolkit.<br />Every tool, and its part in the process.</Text></div>
      <div className={styles.openToolGrid} data-tool-grid>{softwareTools.map((item,index) => <article className={styles.openTool} key={item.name} data-tool-card>
        <div className={styles.openToolTop}><img src={item.logo} alt="" width={48} height={48} loading="lazy" decoding="async" /><span>{String(index+1).padStart(2,'0')}</span></div>
        <Text className={styles.toolDiscipline}>{item.discipline}</Text><Heading as="h4">{item.name}</Heading><Text>{item.description}</Text>
      </article>)}</div>
    </div>
  </Container></section>;
}
