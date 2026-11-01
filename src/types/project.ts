export type CategoryId = 'commercial' | 'hospitality' | 'residential' | 'extra';

export interface ProjectImage {
  src: string;
  thumb: string;
  alt: string;
  width: number;
  height: number;
  source: string;
}

export interface Drawing {
  title: string;
  pdf: string;
  preview: string;
}

export interface Hotspot {
  x: number;
  y: number;
  title: string;
  description: string;
}

export interface Project {
  slug: string;
  title: string;
  client?: string;
  category: CategoryId;
  showInExtraWork?: boolean;
  scope: string;
  description: string;
  status: 'rendered' | 'drawings-only';
  images: ProjectImage[];
  drawings: Drawing[];
  hotspots?: Hotspot[];
  comparison?: {
    before: string;
    after: string;
    beforeLabel: string;
    afterLabel: string;
  };
  sourceFolder: string;
}

export interface ProjectCollection {
  id: CategoryId;
  title: string;
  number: string;
  description: string;
  emptyTitle?: string;
  emptyDescription?: string;
}
