import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, Minus, Plus } from 'lucide-react';
import { collections } from '../data/collections';
import { projects, projectsInCollection } from '../data/projects';
import { ProjectCard } from '../features/projects/ProjectCard';
import { WorkPeek } from '../features/projects/WorkPeek';
import { AppLink, Button, Container, Eyebrow, FloorPlan, Heading, Text } from '../components/ui/Primitives';
import { useWorkAnimations } from '../features/projects/useWorkAnimations';
import { usePageTitle } from '../hooks/usePageTitle';
import { requestRoomScroll } from '../lib/scroll';
import styles from '../features/projects/WorkArchive.module.css';

const curatedCount = 6;

export default function Projects() {
  const root = useRef<HTMLDivElement>(null);
  const [params, setParams] = useSearchParams();
  const [expanded, setExpanded] = useState(false);
  const category = params.get('category') ?? 'all';
  const activeCategory = collections.some((item) => item.id === category) ? category : 'all';
  useWorkAnimations(root, activeCategory, expanded);
  usePageTitle('Selected work');

  const selectCategory = (id: string) => {
    setParams(id === 'all' ? {} : { category: id });
    requestAnimationFrame(() => requestRoomScroll('#work-collections'));
  };

  return (
    <div ref={root} className={styles.page} id="selected-work">
      <div className={styles.intro}>
        <Container className={styles.introRow}>
          <div>
            <Eyebrow>Portfolio / {projects.length} explorations</Eyebrow>
            <Heading as="h1" className={styles.title}>Selected <span>work.</span></Heading>
            <Text>Different spaces. One considered approach.</Text>
          </div>
          <WorkPeek />
        </Container>
      </div>

      <nav className={styles.categoryNav} aria-label="Project categories">
        <Container>
          <div className={styles.categoryScroller} data-lenis-prevent-horizontal>
            <div className={styles.categoryList} data-work-categories>
              <Button variant="quiet" onClick={() => selectCategory('all')} aria-pressed={activeCategory === 'all'}>All work <span>{String(projects.length).padStart(2, '0')}</span></Button>
              {collections.map((collection) => <Button key={collection.id} variant="quiet" onClick={() => selectCategory(collection.id)} aria-pressed={activeCategory === collection.id}>
                {collection.title}<span>{String(projectsInCollection(collection.id).length).padStart(2, '0')}</span>
              </Button>)}
              <span className={styles.categoryIndicator} data-work-indicator aria-hidden="true" />
            </div>
          </div>
        </Container>
      </nav>

      <div id="work-collections" className={styles.collections} aria-label="Work collections">
        {collections.filter((collection) => activeCategory === 'all' || activeCategory === collection.id).map((collection) => {
          const allProjects = projectsInCollection(collection.id)
            .sort((first, second) => Number(second.images.length > 0) - Number(first.images.length > 0));
          const visibleProjects = collection.id === 'extra' && !expanded ? allProjects.slice(0, curatedCount) : allProjects;
          return <section key={collection.id} className={`${styles.collection} ${collection.id === 'extra' ? styles.extra : ''} ${allProjects.length === 0 ? styles.upcoming : ''}`} id={collection.id} aria-labelledby={`${collection.id}-title`}>
            <Container>
              <div className={styles.collectionTop} data-collection-reveal>
                <Eyebrow><span>{collection.number}</span> / The collection</Eyebrow>
                <Text>{allProjects.length > 0 ? `${String(allProjects.length).padStart(2, '0')} explorations` : 'An open chapter'}<ArrowDownRight size={16} /></Text>
              </div>
              <div className={styles.collectionHeading}>
                <Heading id={`${collection.id}-title`}><span data-collection-line>{collection.title}<span className={styles.collectionDot}>.</span></span></Heading>
                <Text data-collection-reveal>{collection.description}</Text>
              </div>
              {allProjects.length > 0 ? <>
                <div className={`${styles.projectGrid} ${collection.id === 'extra' ? styles.extraGrid : ''}`}>
                  {visibleProjects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} sharedLayout={collection.id !== 'extra' || activeCategory === 'extra'} className={styles.archiveCard} imageSizes={collection.id === 'extra' ? '(max-width: 1050px) 44vw, 29vw' : index === 0 ? '(min-width: 1600px) 1376px, 89vw' : '(max-width: 600px) 89vw, 44vw'} />)}
                </div>
                {collection.id === 'extra' && allProjects.length > curatedCount && <div className={styles.expandWork}>
                  <Text aria-live="polite">Showing {String(visibleProjects.length).padStart(2, '0')} of {allProjects.length} explorations</Text>
                  <Button variant="outline" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>{expanded ? 'Back to the selected six' : `Explore all ${allProjects.length} works`}{expanded ? <Minus size={17} /> : <Plus size={17} />}</Button>
                </div>}
              </> : <div className={styles.openChapter} data-collection-reveal>
                <div className={styles.chapterArt} aria-hidden="true"><FloorPlan /><span>{collection.number}</span><span className={styles.chapterArtLabel}>SPACE FOR WHAT’S NEXT</span></div>
                <div className={styles.chapterCopy}><Eyebrow>In the making</Eyebrow><Heading as="h3">{collection.emptyTitle}</Heading><Text>{collection.emptyDescription}</Text><AppLink to="/#contact" className={styles.textLink}>Let’s imagine it together <ArrowUpRight size={18} /></AppLink></div>
              </div>}
            </Container>
          </section>;
        })}
      </div>

      <Container className={styles.pageEnd}><Text>Have a space in mind?</Text><AppLink to="/#contact">Let’s talk <ArrowUpRight size={17} /></AppLink></Container>
    </div>
  );
}
