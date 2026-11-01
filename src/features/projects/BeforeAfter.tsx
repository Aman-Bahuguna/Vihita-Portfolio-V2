import { useState } from 'react';
import { Columns2 } from 'lucide-react';
import type { Project } from '../../types/project';
import { RangeSlider } from '../../components/ui/RangeSlider';
import { Eyebrow } from '../../components/ui/Primitives';
import styles from './Projects.module.css';

export function BeforeAfter({ comparison }: { comparison: NonNullable<Project['comparison']> }) {
  const [position, setPosition] = useState(50);
  return <div className={styles.comparison}>
    <div className={styles.comparisonImages}>
      <img src={comparison.before} alt={comparison.beforeLabel} width="1200" height="800" loading="lazy" />
      <div className={styles.comparisonAfter} style={{ clipPath: `inset(0 0 0 ${position}%)` }}><img src={comparison.after} alt={comparison.afterLabel} width="1200" height="800" loading="lazy" /></div>
      <span className={styles.comparisonDivider} style={{ left: `${position}%` }}><span><Columns2 size={18} /></span></span>
      <div className={styles.comparisonLabels}><Eyebrow>{comparison.beforeLabel}</Eyebrow><Eyebrow>{comparison.afterLabel}</Eyebrow></div>
      <RangeSlider label="Compare existing and proposed boundary wall drawings" min="0" max="100" value={position} onChange={(event) => setPosition(Number(event.target.value))} className={styles.comparisonRange} />
    </div>
    <Eyebrow className={styles.comparisonNote}>Drag to compare · Original working drawings, not before/after photographs</Eyebrow>
  </div>;
}
