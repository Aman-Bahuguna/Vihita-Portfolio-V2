import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button, Eyebrow } from './Primitives';
import { setCursorLayer } from '../../lib/cursor';
import styles from './Modal.module.css';

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    if (element) setCursorLayer(element);
    return () => {
      element?.close();
      setCursorLayer(null);
    };
  }, []);
  return <dialog ref={dialog} className={styles.modal} aria-label={title} data-lenis-prevent onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className={styles.modalHeader}><Eyebrow>{title}</Eyebrow><Button variant="icon" onClick={onClose} aria-label="Close image explorer" autoFocus><X size={19} /></Button></div>
    {children}
  </dialog>;
}
