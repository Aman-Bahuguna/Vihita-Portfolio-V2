import { useTheme } from '../../hooks/useTheme';
import { Button } from './Primitives';
import styles from './ThemeToggle.module.css';

export function ThemeToggle({ className = '', paper = false }: { className?: string; paper?: boolean }) {
  const { theme, switching, toggleTheme } = useTheme();
  const light = theme === 'light';
  const label = `Switch to ${light ? 'dark' : 'light'} mode`;
  return <Button
    variant="quiet"
    className={`${styles.toggle} ${paper ? styles.paper : ''} ${className}`}
    data-light={light}
    data-switching={switching}
    aria-label={label}
    aria-busy={switching}
    aria-pressed={light}
    title={label}
    onClick={(event) => { void toggleTheme(event.currentTarget); }}
  >
    <span className={styles.portal} aria-hidden="true">
      <svg viewBox="0 0 32 36" fill="none">
        <path className={styles.rays} d="M16 1V4M3 8l3 2M29 8l-3 2M1 21h4M27 21h4" />
        <path className={styles.frame} d="M8 31V15a8 8 0 0 1 16 0v16M5 31h22M11 31V15a5 5 0 0 1 10 0v16" />
        <path className={styles.door} d="M11 31V15a5 5 0 0 1 10 0v16Z" />
        <path className={styles.handle} d="M18 21v3" />
      </svg>
    </span>
    <span className={styles.label}>{light ? 'Lights out' : 'Let light in'}</span>
  </Button>;
}
