import rawProjects from './projects.json';
import type { CategoryId, Project, ProjectImage } from '../types/project';

function isCategory(value: string): value is CategoryId {
  return value === 'commercial' || value === 'hospitality' || value === 'residential' || value === 'extra';
}

export const projects: Project[] = rawProjects.map<Project>((project) => {
  if (!isCategory(project.category)) throw new Error(`Unknown project category: ${project.category}`);
  return {
    ...project,
    category: project.category,
    status: project.images.length > 0 ? 'rendered' : 'drawings-only',
  };
});

export function projectsInCollection(category: CategoryId): Project[] {
  return projects.filter((project) => project.category === category || (category === 'extra' && project.showInExtraWork));
}

const selectedSlugs = ['abhishek-residence', 'dc-bond-office', 'vaibhav-soni-residence', 'tushar-kitchen'];
export const selectedProjects = selectedSlugs
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is Project => Boolean(project));

export function projectCover(project: Project): string {
  const coverIndex = project.slug === 'dc-bond-office' ? 1 : 0;
  return project.images[coverIndex]?.src ?? project.drawings[0]?.preview ?? '';
}

export function projectThumbnail(project: Project): string {
  const coverIndex = project.slug === 'dc-bond-office' ? 1 : 0;
  return project.images[coverIndex]?.thumb ?? project.drawings[0]?.preview ?? '';
}

export function imageSrcSet(image: ProjectImage): string {
  const longest = Math.max(image.width, image.height);
  const thumbnailWidth = Math.round(image.width * Math.min(1, 680 / longest));
  const fullWidth = Math.round(image.width * Math.min(1, 1600 / longest));
  return `${image.thumb} ${thumbnailWidth}w, ${image.src} ${fullWidth}w`;
}
