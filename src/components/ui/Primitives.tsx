import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';
import { requestRoomScroll } from '../../lib/scroll';
import styles from './Primitives.module.css';

export function Heading({
  as: Tag = 'h2',
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { as?: 'h1' | 'h2' | 'h3' | 'h4' }) {
  return <Tag className={`${styles.heading} ${className}`} {...props}>{children}</Tag>;
}

export function Text({
  as: Tag = 'p',
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLElement> & { as?: 'p' | 'span' | 'div' }) {
  return <Tag className={`${styles.text} ${className}`} {...props}>{children}</Tag>;
}

export function Eyebrow({ children, className = '', ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`${styles.eyebrow} ${className}`} {...props}>{children}</p>;
}

type Variant = 'solid' | 'outline' | 'text' | 'icon' | 'quiet';
export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }>(
  function Button({ children, className = '', variant = 'solid', type = 'button', ...props }, ref) {
    return <button ref={ref} type={type} className={`${styles.button} ${styles[variant]} ${className}`} {...props}>{children}</button>;
  },
);

export function AppLink({ children, className = '', variant, onClick, ...props }: LinkProps & { variant?: Variant }) {
  return <Link className={`${variant ? `${styles.button} ${styles[variant]}` : ''} ${className}`} {...props} onClick={(event) => {
    onClick?.(event);
    if (!event.defaultPrevented && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey && event.button === 0 && typeof props.to === 'string' && props.to.startsWith('/#') && window.location.pathname === '/' && window.location.hash === props.to.slice(1)) {
      event.preventDefault();
      requestRoomScroll(props.to.slice(1));
    }
  }}>{children}</Link>;
}

export function ExternalLink({
  children, className = '', variant, ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return <a className={`${variant ? `${styles.button} ${styles[variant]}` : ''} ${className}`} {...props}>{children}</a>;
}

export function Container({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`${styles.container} ${className}`} {...props}>{children}</div>;
}

export function SectionLabel({ number, children, light = false }: { number: string; children: ReactNode; light?: boolean }) {
  return <Text className={`${styles.sectionLabel} ${light ? styles.light : ''}`} data-section={number}>{children}</Text>;
}

export function DoorMark({ className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 44 54" fill="none" aria-hidden="true" className={className} {...props}>
      <path d="M7 49V21a15 15 0 0 1 30 0v28M15 49V23a7 7 0 0 1 14 0v26M2 49h40" stroke="currentColor" strokeWidth="1.35" />
      <path d="M22 23v26l7-4V22" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="25" cy="36" r=".8" fill="currentColor" />
    </svg>
  );
}

export function BrandMark({ tone = 'accent', className = '', ...props }: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & { tone?: 'accent' | 'ink' }) {
  return <img src={`/logos/vihita-${tone}.png`} alt="" aria-hidden="true" width={44} height={54} decoding="async" className={`${tone === 'accent' ? styles.brandMarkAccent : ''} ${className}`} {...props} />;
}

export function FloorPlan({ className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 44 44" fill="none" aria-hidden="true" className={className} {...props}>
      <path d="M4 4h36v36H4V4Zm18 0v15M4 22h14m8 0h14M22 28v12" stroke="currentColor" strokeWidth="1.4" />
      <path d="M22 19a7 7 0 0 1 7 7M18 22a6 6 0 0 1 6-6" stroke="currentColor" strokeWidth=".8" />
      <path d="M22 19h7v7M18 22v-6h6" stroke="currentColor" strokeWidth=".65" />
    </svg>
  );
}
