import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import type { Project } from '../../types/project';
import { imageSrcSet, projectThumbnail } from '../../data/projects';
import { AppLink, Eyebrow, Heading, Text } from '../../components/ui/Primitives';
import { useMotionSettings } from '../../hooks/useMotionSettings';
import styles from './Projects.module.css';

export function ProjectCard({ project, index = 0, gallery = false, sharedLayout = true, className = '', imageSizes }: { project: Project; index?: number; gallery?: boolean; sharedLayout?: boolean; className?: string; imageSizes?: string }) {
  const { reducedMotion } = useMotionSettings();
  const cover = project.images[project.slug === 'dc-bond-office' ? 1 : 0];
  return (
    <AppLink to={`/projects/${project.slug}`} className={`${styles.projectCard} ${gallery ? styles.galleryCard : ''} ${project.status === 'drawings-only' ? styles.drawingCard : ''} ${className}`} data-cursor="View" data-project-card data-gallery-card={gallery || undefined}>
      <div className={styles.cardImage} data-card-media>
        <motion.img layoutId={reducedMotion || !sharedLayout ? undefined : `project-${project.slug}`} src={projectThumbnail(project)} srcSet={cover ? imageSrcSet(cover) : undefined} sizes={imageSizes ?? (gallery ? '(max-width: 700px) 84vw, (max-width: 1049px) 74vw, 54vw' : '(max-width: 650px) 90vw, 45vw')} alt={`${project.title} — ${project.scope}`} loading="lazy" decoding="async" width={cover?.width ?? 1200} height={cover?.height ?? 900} onError={(event) => {
          const image = event.currentTarget;
          const fallback = cover?.src;
          if (!fallback || image.dataset.fallback) return;
          image.dataset.fallback = 'true';
          image.removeAttribute('srcset');
          image.src = fallback;
        }} />
        <span className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.cardArrow} data-card-arrow><ArrowUpRight size={21} /></span>
        {project.status === 'drawings-only' && <Eyebrow className={styles.drawingTag}>From the drawing board</Eyebrow>}
      </div>
      <div className={styles.cardInfo} data-card-info><div><Eyebrow>{project.scope}</Eyebrow><Heading as="h3">{project.title}</Heading></div><Text as="span">{project.images.length > 0 ? `${String(project.images.length).padStart(2, '0')} views` : `${project.drawings.length} drawing${project.drawings.length > 1 ? 's' : ''}`}</Text></div>
    </AppLink>
  );
}
