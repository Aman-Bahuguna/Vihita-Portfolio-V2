import { CirclePause, Play } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useMotionSettings } from '../../hooks/useMotionSettings';
import { Button } from './Primitives';
import styles from './Layout.module.css';
import landing from './LandingChrome.module.css';

export function ExperienceControls() {
  const { pathname } = useLocation();
  const { reducedMotion, toggleMotion } = useMotionSettings();
  return <div className={`${styles.experienceControls} ${!pathname.startsWith('/projects/') ? landing.controls : ''}`} aria-label="Experience settings">
    <Button variant="quiet" onClick={toggleMotion} aria-pressed={reducedMotion} aria-label="Reduce motion" title={reducedMotion ? 'Enable animations' : 'Reduce motion'} className={styles.motionControl}>{reducedMotion ? <Play size={14} aria-hidden="true" /> : <CirclePause size={14} aria-hidden="true" />}<span>{reducedMotion ? 'Motion reduced' : 'Reduce motion'}</span></Button>
  </div>;
}
