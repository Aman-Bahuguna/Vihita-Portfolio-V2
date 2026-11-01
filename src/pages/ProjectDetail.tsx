import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, FileText, Maximize2, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { projects } from '../data/projects';
import { collections } from '../data/collections';
import { usePageAnimations } from '../hooks/usePageAnimations';
import { usePageTitle } from '../hooks/usePageTitle';
import { useMotionSettings } from '../hooks/useMotionSettings';
import { AppLink, Button, Container, ExternalLink, Eyebrow, Heading, Text } from '../components/ui/Primitives';
import { ImageExplorer } from '../features/projects/ImageExplorer';
import { BeforeAfter } from '../features/projects/BeforeAfter';
import NotFound from './NotFound';
import styles from '../features/projects/Projects.module.css';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((item) => item.slug === slug);
  const root = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [hotspot, setHotspot] = useState<number | null>(null);
  const { reducedMotion } = useMotionSettings();
  usePageAnimations(root);
  usePageTitle(project?.title ?? 'Room not found');
  useEffect(() => { setIndex(slug === 'dc-bond-office' ? 1 : 0); setHotspot(null); setExplorerOpen(false); }, [slug]);
  if (!project) return <NotFound />;
  const collectionTitle = collections.find((collection) => collection.id === project.category)?.title ?? project.category;
  const selectedImage = project.images[index] ?? project.images[0];
  const currentProjectIndex = projects.findIndex((item) => item.slug === slug);
  const nextProject = projects[(currentProjectIndex + 1) % projects.length];
  return (
    <div ref={root} className={styles.detailPage}>
      <Container className={styles.detailIntro}>
        <AppLink to={`/projects?category=${project.category}`} className={styles.backLink}><ArrowLeft size={14} />Back to {project.category === 'extra' ? 'the drawing room' : 'the collection'}</AppLink>
        <Eyebrow>{project.scope} / {collectionTitle} collection</Eyebrow>
        <Heading as="h1">{project.title}<em>.</em></Heading>
        <div className={styles.projectDescription}><Text>{project.description}</Text><div><Eyebrow>Available to explore</Eyebrow><span>{project.images.length} visualizations / {project.drawings.length} drawing files</span></div></div>
      </Container>
      {selectedImage ? <>
        <div className={styles.detailImageStage}>
          <motion.img layoutId={reducedMotion ? undefined : `project-${project.slug}`} src={selectedImage.src} alt={selectedImage.alt} width={selectedImage.width} height={selectedImage.height} className={styles.detailHeroImage} fetchPriority="high" />
          {index === 0 && project.hotspots?.map((spot, i) => <div key={spot.title} className={styles.hotspotWrap} style={{ left: `${spot.x}%`, top: `${spot.y}%` }}>
            <Button variant="icon" className={styles.hotspot} onClick={() => setHotspot(hotspot === i ? null : i)} aria-label={`Explore ${spot.title}`} aria-expanded={hotspot === i}><Plus size={15} /></Button>
            {hotspot === i && <div className={styles.hotspotDetail}><Heading as="h3">{spot.title}</Heading><Text>{spot.description}</Text></div>}
          </div>)}
          <Button variant="quiet" className={styles.exploreImageButton} onClick={() => setExplorerOpen(true)}><Maximize2 size={15} />Look a little closer</Button>
          <div className={styles.detailImageControls}><Button variant="icon" onClick={() => { setIndex((index - 1 + project.images.length) % project.images.length); setHotspot(null); }} aria-label="Previous project view"><ChevronLeft /></Button><Eyebrow aria-live="polite">{String(index + 1).padStart(2, '0')} / {String(project.images.length).padStart(2, '0')}</Eyebrow><Button variant="icon" onClick={() => { setIndex((index + 1) % project.images.length); setHotspot(null); }} aria-label="Next project view"><ChevronRight /></Button></div>
        </div>
        <Container><div className={styles.detailImageNote}><Eyebrow>Supplied design visualization</Eyebrow><Text>{index === 0 && project.hotspots ? 'Tap a marker to explore the thinking behind the details.' : 'One space. Another perspective.'}</Text></div>
          <div className={styles.detailThumbnails}>{project.images.map((image, i) => <Button key={image.src} variant="quiet" aria-label={`Select project view ${i + 1}`} aria-pressed={index === i} onClick={() => { setIndex(i); setHotspot(null); }} className={index === i ? styles.activeThumb : ''}><img src={image.thumb} alt="" width="150" height="110" loading="lazy" /><span>{String(i + 1).padStart(2, '0')}</span></Button>)}</div></Container>
      </> : <Container><div className={styles.drawingHero}><img src={project.drawings[0]?.preview} alt={`${project.title} — original working drawing`} width="1200" height="900" /><Eyebrow>A spatial idea, in its most honest form.</Eyebrow></div></Container>}
      {project.comparison && <Container className={styles.detailSection}><Eyebrow>From existing to imagined</Eyebrow><Heading>A change, <em>drawn out.</em></Heading><Text>The supplied existing and proposed boundary-wall drawings offer a closer look at the renovation thinking.</Text><BeforeAfter comparison={project.comparison} /></Container>}
      <Container className={styles.detailSection}>
        <div className={styles.drawingsHeading}><div><Eyebrow>The thinking beneath the finish</Eyebrow><Heading>Behind <em>the walls.</em></Heading></div><Text>Original working drawings.<br />Open the files to explore every line.</Text></div>
        <div className={styles.drawingList}>{project.drawings.map((drawing, i) => <ExternalLink key={drawing.pdf} href={drawing.pdf} target="_blank" rel="noreferrer" className={styles.drawingLink}><span>{String(i + 1).padStart(2, '0')}</span><FileText size={17} /><Text>{drawing.title}</Text><Eyebrow>View PDF</Eyebrow><ArrowUpRight size={17} /></ExternalLink>)}</div>
      </Container>
      <Container className={styles.nextProject}><Eyebrow>Through the next doorway</Eyebrow><AppLink to={`/projects/${nextProject.slug}`}><Heading>{nextProject.title}</Heading><ArrowUpRight strokeWidth={0.7} /></AppLink><AppLink to="/projects" variant="text">Back to all spaces <ArrowUpRight /></AppLink></Container>
      {explorerOpen && <ImageExplorer images={project.images} initialIndex={index} title={project.title} onClose={() => setExplorerOpen(false)} />}
    </div>
  );
}
