import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Button, Eyebrow, Heading, Text } from '../../components/ui/Primitives';
import styles from './Designer.module.css';

const lenses = [
  { label: 'Function', title: 'Space to move.', copy: 'A natural flow. A place for everything. Design that quietly makes everyday life easier.' },
  { label: 'Feeling', title: 'Room to breathe.', copy: 'Light that lingers, soft edges, and moments of calm. The atmosphere is part of the architecture.' },
  { label: 'Soul', title: 'Something that’s you.', copy: 'An unexpected detail. A favourite object. The personal touches that turn a space into your own.' },
] as const;

export function PerspectiveStudy() {
  const [lens, setLens] = useState(0);
  const current = lenses[lens];
  return <div className={styles.study} data-lens={lens} data-reveal>
    <div className={styles.studyTop}><Eyebrow>A SPACE. THREE PERSPECTIVES.</Eyebrow><ArrowUpRight size={18} /></div>
    <div className={styles.studyDrawing}>
      <Text className={styles.studyAnnotation}>AN EXERCISE IN INTENTION</Text>
      <svg viewBox="0 0 520 370" role="img" aria-label={`Conceptual living room study: ${current.label.toLowerCase()}`}>
        <g className={styles.roomStructure} strokeLinejoin="round" strokeLinecap="round">
          <path className={styles.roomWall} d="M65 225V125L260 12v100Z" />
          <path className={styles.roomWallRight} d="M260 12 455 125v100L260 112Z" />
          <path className={styles.roomFloor} d="m65 225 195-113 195 113-195 113Z" />
          <path d="M65 125 260 12l195 113M260 12v100M65 225l195 113 195-113" fill="none" />
          <path className={styles.roomWindow} d="m307 64 104 60v62l-104-60Z" />
          <path d="m359 94 0 62m-52-61 104 60" fill="none" />
          <g className={styles.studyLight}>
            <path d="m307 126 104 60-104 86-104-60Z" />
            <path d="m340 146-104 85m70-65-104 85" fill="none" />
          </g>
          <path className={styles.roomRug} d="m143 236 115-67 114 66-114 67Z" />
          <g className={styles.roomSofa}>
            <path d="m112 197 74-43 84 48-74 43Z" />
            <path d="M112 197v26l84 48v-26Zm84 48 74-43v26l-74 43Z" />
            <path d="M112 197v-28l74-43v28Zm0-28 14 8 74-43-14-8Z" />
            <path d="m126 177 74-43v28l-74 43Zm32 20 36 21m-30-43 36 21" fill="none" />
          </g>
          <g className={styles.roomTable}>
            <path d="m249 231 43-25 43 25-43 25Z" />
            <path d="M249 231v15m43 10v15m43-40v15" fill="none" />
          </g>
          <g className={styles.studyFlow}>
            <path d="m196 307 78-45 90 2 48-28" fill="none" strokeDasharray="5 6" />
            <path d="m401 234 11 2-3 11" fill="none" />
            <circle cx="196" cy="307" r="4" />
          </g>
          <g className={styles.studyDetails}>
            <path d="m370 235 9 24 18-10 4-27Z" />
            <path d="M386 235v-49m0 29c-24-1-26-20-26-20 24 0 26 20 26 20Zm0-12c19-2 23-24 23-24-24 3-23 24-23 24Z" />
            <path d="m150 125 30-18v-35l-30 18Z" />
            <path d="m158 105 14-19m-14 11 14 5" fill="none" />
            <ellipse cx="292" cy="227" rx="8" ry="4" />
          </g>
          <g className={styles.studyDimensions} fill="none">
            <path d="m57 250 184 107m-189-99 10-16m173 123 11-16M280 357l184-107m-189 100 10 15m174-123 10 16" />
          </g>
        </g>
      </svg>
      <div className={styles.studyDrawingFoot}><Text>VK — SPATIAL STUDY / 01</Text><Text>CONCEPT, NOT A BUILT PROJECT</Text></div>
    </div>
    <div className={styles.studyControls} role="group" aria-label="Explore a design perspective">
      {lenses.map((item, index) => <Button key={item.label} variant="quiet" aria-pressed={lens === index} aria-controls="perspective-description" onClick={() => setLens(index)}><span>0{index + 1}</span>{item.label}</Button>)}
    </div>
    <div className={styles.studyDescription} id="perspective-description" aria-live="polite" aria-atomic="true"><Heading as="h3">{current.title}</Heading><Text>{current.copy}</Text></div>
  </div>;
}
