import { ArrowUpRight } from 'lucide-react';
import { AppLink, Container, Eyebrow, FloorPlan, Heading, Text } from '../components/ui/Primitives';
import { collections } from '../data/collections';
import { projects } from '../data/projects';
import { usePageTitle } from '../hooks/usePageTitle';
import styles from './SiteMap.module.css';

export default function SiteMap() {
  usePageTitle('Site map');
  return <section className={styles.page}>
    <Container>
      <Eyebrow className={styles.kicker}><FloorPlan /> A guide to this space</Eyebrow>
      <Heading as="h1">The open plan.</Heading>
      <Text className={styles.intro}>Every room, every project. Find your own way through.</Text>
      <nav aria-label="Site map" className={styles.grid}>
        <div><Heading as="h2">The portfolio</Heading>
          {[['/', 'The entrance'], ['/about', 'The designer'], ['/projects', 'Selected work'], ['/#studio', 'Expertise & toolkit'], ['/#contact', 'Let’s talk']].map(([to, label]) => <AppLink key={to} to={to}>{label}<ArrowUpRight size={16} /></AppLink>)}
        </div>
        {collections.map((collection) => <div key={collection.id}>
          <Heading as="h2">{collection.title}</Heading>
          <AppLink to={`/projects?category=${collection.id}`} className={styles.collection}>View collection<ArrowUpRight size={16} /></AppLink>
          {projects.filter((project) => project.category === collection.id).map((project) => <AppLink key={project.slug} to={`/projects/${project.slug}`}>{project.title}<ArrowUpRight size={16} /></AppLink>)}
        </div>)}
      </nav>
    </Container>
  </section>;
}
