import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Plus, X } from 'lucide-react';
import gsap from 'gsap';
import { selectedProjects, projectThumbnail } from '../../data/projects';
import { AppLink, Button, Eyebrow, Text } from '../../components/ui/Primitives';
import { useMotionSettings } from '../../hooks/useMotionSettings';
import styles from './WorkPeek.module.css';

const previewProjects = [selectedProjects[1], selectedProjects[0], selectedProjects[2]].filter(Boolean);

export function WorkPeek() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const { reducedMotion } = useMotionSettings();

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setOpen(false);
      trigger.current?.focus({ preventScroll: true });
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open || reducedMotion) return;
    // Playbook 45: the small stack fans out only when invited.
    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from(panel.current, { opacity: 0, y: -8, scale: 0.96, duration: 0.3, transformOrigin: 'top right' })
        .from('[data-peek-card]', { y: 30, rotation: 0, scale: 0.9, opacity: 0, duration: 0.55, stagger: 0.07, clearProps: 'transform,opacity' }, 0.08);
    }, root);
    return () => context.revert();
  }, [open, reducedMotion]);

  const close = () => {
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  };

  return <div ref={root} className={styles.root} onBlur={(event) => {
    if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <Button ref={trigger} variant="quiet" className={styles.trigger} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={id}>
      <span className={styles.miniStack} aria-hidden="true">
        {previewProjects.map((project) => <span key={project.slug}><img src={projectThumbnail(project)} alt="" width={48} height={36} /></span>)}
      </span>
      <span>{open ? 'Put it away' : 'A quick peek'}</span>
      <span className={styles.triggerIcon}>{open ? <X size={15} /> : <Plus size={15} />}</span>
    </Button>
    {open && <div ref={panel} className={styles.panel} id={id} role="region" aria-labelledby={`${id}-label`}>
      <div className={styles.panelTop}><Eyebrow id={`${id}-label`}>The spatial edit</Eyebrow><Button variant="quiet" className={styles.close} onClick={close} aria-label="Close project preview"><X size={16} /></Button></div>
      <div className={styles.deck}>
        {previewProjects.map((project, index) => <AppLink key={project.slug} to={`/projects/${project.slug}`} className={styles.card} data-peek-card aria-label={`Explore ${project.title}`} data-cursor="View">
          <img src={projectThumbnail(project)} alt={`${project.title} — ${project.scope}`} width={680} height={510} />
          <span className={styles.caption}><span>{String(index + 1).padStart(2, '0')} / {project.title}</span><ArrowUpRight size={14} /></span>
        </AppLink>)}
      </div>
      <div className={styles.panelBottom}><Text>Pick a card. Step inside.</Text><span>01 — 03</span></div>
    </div>}
  </div>;
}
