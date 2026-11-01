import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy, Download, MoveUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { designer } from '../../data/designer';
import { useMotionSettings } from '../../hooks/useMotionSettings';
import { AppLink, Button, Container, ExternalLink, Heading, Text } from '../ui/Primitives';
import styles from './Home.module.css';

gsap.registerPlugin(ScrollTrigger);

export function AboutThreshold() {
  const root = useRef<HTMLElement>(null);
  const { reducedMotion } = useMotionSettings();
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const context = gsap.context(() => {
      gsap.from('[data-portrait-window]', { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'power3.inOut', scrollTrigger: { trigger: root.current, start: 'top 78%', once: true } });
      gsap.fromTo('[data-portrait-image]', { scale: 1.12, yPercent: -5 }, { scale: 1.04, yPercent: 5, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.from('[data-person-line]', { yPercent: 110, stagger: 0.1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 70%', once: true } });
    }, root);
    return () => context.revert();
  }, [reducedMotion]);
  return <section className={styles.aboutThreshold} ref={root}>
    <Container className={styles.thresholdInner}>
      <div className={styles.thresholdPortrait} data-portrait-window><img src={designer.headshot} alt="Vihita Khurana, interior architectural designer, smiling in a black blazer" width="1086" height="1448" loading="lazy" data-portrait-image /><span className={styles.portraitCorner} aria-hidden="true"><MoveUpRight strokeWidth={1} /></span></div>
      <div className={styles.thresholdCopy}><Text className={styles.sectionKicker}>The person behind the plan</Text><Heading><span><span data-person-line>HI, I’M</span></span><span><span data-person-line>VIHITA.</span></span></Heading><Text>A curious eye for materials. A considered approach to space. I’m exploring how the places around us can feel more personal.</Text><div className={styles.educationNote}><span>Pearl Academy</span><span>Interior Architectural Design · 2024–2028</span></div><div className={styles.thresholdLinks}><AppLink to="/about" className={styles.textLink}>Meet the designer <ArrowUpRight size={20} /></AppLink><ExternalLink href={designer.resume} target="_blank" rel="noreferrer" className={styles.resumeLink}>Résumé <Download size={16} /></ExternalLink></div></div>
    </Container>
  </section>;
}

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const copyLabel = useRef<HTMLSpanElement>(null);
  const reset = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copyState, setCopyState] = useState<'ready' | 'copied' | 'unavailable'>('ready');
  const { reducedMotion } = useMotionSettings();
  useEffect(() => () => { if (reset.current) clearTimeout(reset.current); }, []);
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const context = gsap.context(() => {
      gsap.from('[data-contact-line]', { yPercent: 110, duration: 1.1, stagger: 0.12, ease: 'power4.out', scrollTrigger: { trigger: root.current, start: 'top 80%', once: true } });
      gsap.from('[data-contact-rule]', { scaleX: 0, transformOrigin: 'left', duration: 1.1, ease: 'power3.inOut', scrollTrigger: { trigger: root.current, start: 'top 65%', once: true } });
    }, root);
    return () => context.revert();
  }, [reducedMotion]);
  useLayoutEffect(() => {
    if (reducedMotion || !copyLabel.current) return;
    const context = gsap.context(() => {
      gsap.fromTo(copyLabel.current, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25 });
    }, copyLabel);
    return () => context.revert();
  }, [copyState, reducedMotion]);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(designer.email);
      setCopyState('copied');
    } catch {
      setCopyState('unavailable');
    }
    if (reset.current) clearTimeout(reset.current);
    reset.current = setTimeout(() => setCopyState('ready'), 3500);
  };

  return <section id="contact" className={styles.contact} ref={root}>
    <Container>
      <div className={styles.contactTop}><Text>Have a project in mind?</Text><ArrowUpRight size={25} strokeWidth={1.3} /></div>
      <ExternalLink href={`mailto:${designer.email}`} className={styles.contactHeadline} aria-label="Start a project conversation by email">
        <Heading className={styles.contactTitle}><span><span data-contact-line>LET’S MAKE</span></span><span><span data-contact-line>IT HAPPEN.</span></span></Heading><span className={styles.contactArrow}><ArrowUpRight strokeWidth={1.1} /></span>
      </ExternalLink>
      <div className={styles.contactRule} data-contact-rule />
      <div className={styles.contactDetails}>
        <div className={styles.emailGroup}><Text>Say hello</Text><ExternalLink href={`mailto:${designer.email}`} className={styles.emailAddress}>{designer.email}</ExternalLink><Button variant="quiet" className={styles.copyEmail} onClick={() => void copyEmail()} aria-label="Copy email address">{copyState === 'copied' ? <Check size={15} /> : <Copy size={15} />}<span ref={copyLabel}>{copyState === 'copied' ? 'Copied to clipboard' : copyState === 'unavailable' ? 'Please select and copy the email' : 'Copy email'}</span></Button><span className="sr-only" role="status">{copyState === 'copied' ? 'Email copied to clipboard' : copyState === 'unavailable' ? 'Clipboard unavailable. You can select the email address to copy it.' : ''}</span></div>
        <div><Text>Let’s talk</Text><ExternalLink href={designer.phoneHref} className={styles.contactPhone}>{designer.phone} <ArrowUpRight size={18} /></ExternalLink></div>
        <div className={styles.contactLocation}><Text>Based in</Text><span>Jaipur, Rajasthan<br />India</span></div>
      </div>
    </Container>
  </section>;
}
