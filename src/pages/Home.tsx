import { useRef } from 'react';
import { Entrance } from '../components/sections/Entrance';
import { Studio } from '../components/sections/Studio';
import { Gallery } from '../components/sections/Gallery';
import { AboutThreshold, Contact } from '../components/sections/Contact';
import { usePageAnimations } from '../hooks/usePageAnimations';
import { usePageTitle } from '../hooks/usePageTitle';
import { SpatialStory } from '../components/sections/SpatialStory';
import styles from '../components/sections/Home.module.css';

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  usePageAnimations(root);
  usePageTitle('Spaces with soul');
  return <div ref={root} className={styles.page}><Entrance /><SpatialStory /><Studio /><Gallery /><AboutThreshold /><Contact /></div>;
}
