export interface SoftwareTool {
  name: string;
  logo: string;
  discipline: string;
  description: string;
}

export const softwareTools: SoftwareTool[] = [
  {
    name: 'AutoCAD',
    logo: '/logos/autocad.png',
    discipline: 'Drafting',
    description: 'Space planning, furniture layouts, elevations, and the working drawings that make a concept precise.',
  },
  {
    name: 'SketchUp',
    logo: '/logos/sketchup.png',
    discipline: '3D modelling',
    description: 'Exploring volume, proportion, and the relationship between the objects and architecture of a room.',
  },
  {
    name: 'V-Ray',
    logo: '/logos/vray.png',
    discipline: 'Rendering',
    description: 'Studying light, materials, and atmosphere through architectural visualisation.',
  },
  {
    name: 'Photoshop',
    logo: '/logos/photoshop.png',
    discipline: 'Visual development',
    description: 'Bringing imagery, material references, and presentation compositions into one visual language.',
  },
  {
    name: 'Enscape',
    logo: '/logos/enscape.png',
    discipline: 'Real-time visualisation',
    description: 'Looking through a design in real time to understand its scale, light, and spatial character.',
  },
  {
    name: 'Illustrator',
    logo: '/logos/illustrator.png',
    discipline: 'Graphic communication',
    description: 'Clear diagrams, considered graphic details, and visual explanations of a design idea.',
  },
  {
    name: 'Canva',
    logo: '/logos/canva.png',
    discipline: 'Presentation',
    description: 'Organising references, mood boards, and design narratives into accessible presentations.',
  },
  {
    name: 'Premiere Pro',
    logo: '/logos/premiere-pro.png',
    discipline: 'Motion & storytelling',
    description: 'Editing moving-image presentations that communicate a space beyond a single still view.',
  },
];
