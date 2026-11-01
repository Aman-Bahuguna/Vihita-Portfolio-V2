import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface MotionSettings {
  reducedMotion: boolean;
  toggleMotion: () => void;
}

const MotionContext = createContext<MotionSettings>({ reducedMotion: false, toggleMotion: () => undefined });

export function MotionProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<boolean | null>(() => {
    try {
      const saved = localStorage.getItem('vihita-motion');
      return saved === 'reduced' ? true : saved === 'full' ? false : null;
    } catch { return null; }
  });
  const [systemReduced, setSystemReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const reducedMotion = preference ?? systemReduced;
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSystemReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useLayoutEffect(() => {
    document.documentElement.dataset.motion = reducedMotion ? 'reduced' : 'full';
  }, [reducedMotion]);
  const toggleMotion = useCallback(() => {
    const next = !reducedMotion;
    setPreference(next);
    try { localStorage.setItem('vihita-motion', next ? 'reduced' : 'full'); } catch { /* The control still works when browser storage is blocked. */ }
  }, [reducedMotion]);
  return <MotionContext.Provider value={{ reducedMotion, toggleMotion }}>{children}</MotionContext.Provider>;
}

export const useMotionSettings = () => useContext(MotionContext);
