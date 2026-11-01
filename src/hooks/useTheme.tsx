import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useMotionSettings } from './useMotionSettings';
import { ThemeTransition } from '../components/animations/ThemeTransition';
import type { ThemeTransitionHandle } from '../components/animations/ThemeTransition';

type Theme = 'dark' | 'light';
interface ThemeSettings {
  theme: Theme;
  switching: boolean;
  toggleTheme: (origin: HTMLElement) => void;
}

const ThemeContext = createContext<ThemeSettings>({ theme: 'dark', switching: false, toggleTheme: () => undefined });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  const [switching, setSwitching] = useState(false);
  const busy = useRef(false);
  const screen = useRef<ThemeTransitionHandle>(null);
  const { reducedMotion } = useMotionSettings();

  const applyTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    root.dataset.theme = next;
    setTheme(next);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', getComputedStyle(root).getPropertyValue('--landing-bg').trim());
    try { localStorage.setItem('vihita-theme', next); } catch { /* The theme still works when browser storage is blocked. */ }
  }, []);

  useEffect(() => {
    if (reducedMotion) screen.current?.finish();
  }, [reducedMotion]);

  useEffect(() => () => {
    screen.current?.finish();
    delete document.documentElement.dataset.themeTransition;
  }, []);

  const toggleTheme = useCallback(async (origin: HTMLElement) => {
    if (busy.current) return;
    const next = theme === 'dark' ? 'light' : 'dark';
    if (reducedMotion) { applyTheme(next); return; }
    const bounds = origin.getBoundingClientRect();
    busy.current = true;
    setSwitching(true);
    document.documentElement.dataset.themeTransition = 'arch';
    try {
      if (!screen.current) { applyTheme(next); return; }
      await screen.current.play(next, { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 }, () => {
        applyTheme(next);
      });
    } catch {
      screen.current?.finish();
      applyTheme(next);
    } finally {
      delete document.documentElement.dataset.themeTransition;
      busy.current = false;
      setSwitching(false);
    }
  }, [theme, reducedMotion, applyTheme]);

  return <ThemeContext.Provider value={{ theme, switching, toggleTheme }}>{children}<ThemeTransition ref={screen} /></ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
