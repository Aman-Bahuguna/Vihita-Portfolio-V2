import type { ProjectCollection } from '../types/project';

export const collections: ProjectCollection[] = [
  {
    id: 'commercial',
    title: 'Commercial',
    number: '01',
    description: 'Workspaces, retail interiors, and commercial planning studies.',
  },
  {
    id: 'hospitality',
    title: 'Hospitality',
    number: '02',
    description: 'Spaces for a moment away.',
    emptyTitle: 'A new place to arrive.',
    emptyDescription: 'This collection is waiting for its first project assets. A little room for what comes next.',
  },
  {
    id: 'residential',
    title: 'Residential',
    number: '03',
    description: 'An evolving collection of places to call home.',
    emptyTitle: 'There’s room for more.',
    emptyDescription: 'New residential studies will appear here as the collection grows.',
  },
  {
    id: 'extra',
    title: 'Extra work',
    number: '04',
    description: 'Supplementary working drawings, kitchen studies, and layouts from the Commercial and Residential collections, gathered in one place.',
    emptyTitle: 'An open page.',
    emptyDescription: 'Additional drawing studies will appear here when added.',
  },
];
