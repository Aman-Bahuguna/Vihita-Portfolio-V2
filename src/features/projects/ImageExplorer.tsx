import { useState } from 'react';
import { motion, useMotionValue } from 'motion/react';
import { ChevronLeft, ChevronRight, Minus, Move, Plus, RotateCcw } from 'lucide-react';
import type { ProjectImage } from '../../types/project';
import { Modal } from '../../components/ui/Modal';
import { Button, Eyebrow, Text } from '../../components/ui/Primitives';
import styles from './Projects.module.css';

export function ImageExplorer({ images, initialIndex, title, onClose }: { images: ProjectImage[]; initialIndex: number; title: string; onClose: () => void }) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const reset = () => { setZoom(1); x.set(0); y.set(0); };
  const change = (direction: number) => { setIndex((current) => (current + direction + images.length) % images.length); reset(); };
  return <Modal title={`${title} — image explorer`} onClose={onClose}>
    <div className={styles.explorerStage} data-cursor={zoom > 1 ? 'Drag' : undefined} onKeyDown={(event) => {
      if (event.key === '+' || event.key === '=') setZoom((current) => Math.min(3, current + 0.25));
      if (event.key === '-') setZoom((current) => Math.max(1, current - 0.25));
      if (event.key === 'ArrowRight') change(1);
      if (event.key === 'ArrowLeft') change(-1);
    }} tabIndex={0} role="group" aria-label="Zoomable project image. Use plus and minus to zoom, arrow keys to change views.">
      <motion.img key={images[index].src} src={images[index].src} alt={images[index].alt} width={images[index].width} height={images[index].height} style={{ scale: zoom, x, y }} drag={zoom > 1} dragConstraints={{ left: -220 * (zoom - 1), right: 220 * (zoom - 1), top: -160 * (zoom - 1), bottom: 160 * (zoom - 1) }} dragElastic={0.05} draggable={false} />
    </div>
    <div className={styles.explorerToolbar}>
      <div><Button variant="icon" onClick={() => change(-1)} aria-label="Previous image"><ChevronLeft /></Button><Eyebrow aria-live="polite">{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</Eyebrow><Button variant="icon" onClick={() => change(1)} aria-label="Next image"><ChevronRight /></Button></div>
      <Text><Move size={13} />{zoom > 1 ? 'Drag to look a little closer' : 'Zoom in to explore the details'}</Text>
      <div><Button variant="icon" onClick={() => setZoom(Math.max(1, zoom - 0.25))} disabled={zoom <= 1} aria-label="Zoom out"><Minus /></Button><Eyebrow aria-live="polite">{Math.round(zoom * 100)}%</Eyebrow><Button variant="icon" onClick={() => setZoom(Math.min(3, zoom + 0.25))} disabled={zoom >= 3} aria-label="Zoom in"><Plus /></Button><Button variant="icon" onClick={reset} aria-label="Reset image view"><RotateCcw /></Button></div>
    </div>
    <div className={styles.explorerFilmstrip}>{images.map((image, i) => <Button key={image.src} variant="quiet" className={index === i ? styles.activeThumb : ''} aria-label={`View image ${i + 1}`} aria-pressed={index === i} onClick={() => { setIndex(i); reset(); }}><img src={image.thumb} alt="" width="90" height="60" loading="lazy" /></Button>)}</div>
  </Modal>;
}
