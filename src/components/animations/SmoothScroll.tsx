import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocation } from 'react-router-dom';
import { useMotionSettings } from '../../hooks/useMotionSettings';
import { requestRoomScroll, ROOM_SCROLL_EVENT } from '../../lib/scroll';

gsap.registerPlugin(ScrollTrigger);
// Mobile browser chrome changes height during a swipe without changing the layout.
ScrollTrigger.config({ ignoreMobileResize: true });

export function SmoothScroll() {
  const { reducedMotion } = useMotionSettings();
  useEffect(() => {
    if (reducedMotion) return;
    const media = gsap.matchMedia();
    // Touch keeps native momentum scrolling; GSAP still follows its scroll events.
    media.add('(hover: hover) and (pointer: fine)', () => {
      const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: true });
      const update = (time: number) => lenis.raf(time * 1000);
      const scroll = (event: Event) => {
        event.preventDefault();
        const target = (event as CustomEvent<string | number>).detail;
        lenis.scrollTo(target, { immediate: typeof target === 'number' });
      };
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0);
      window.addEventListener(ROOM_SCROLL_EVENT, scroll);
      return () => {
        gsap.ticker.remove(update);
        window.removeEventListener(ROOM_SCROLL_EVENT, scroll);
        lenis.destroy();
      };
    });
    return () => media.revert();
  }, [reducedMotion]);
  return null;
}

export function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const main = document.getElementById('main-content');
    if (!main) return;
    let disposed = false;
    let initialized = false;
    let timer = 0;
    const refresh = () => {
      if (document.hidden) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (disposed || main.querySelector('[data-page-loading]')) return;
        if (initialized) {
          // A forced refresh writes the scroll position and can cancel a native swipe or anchor jump.
          ScrollTrigger.refresh(true);
          return;
        }
        ScrollTrigger.refresh();
        const target = hash && document.getElementById(hash.slice(1));
        if (hash && !target) return;
        initialized = true;
        content.disconnect();
        requestRoomScroll(target ? hash : 0);
      }, 100);
    };
    const resize = new ResizeObserver(refresh);
    const content = new MutationObserver(refresh);
    resize.observe(main);
    content.observe(main, { childList: true, subtree: true });
    // Reserved image sizes do not change layout. ResizeObserver catches actual size changes.
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('pageshow', refresh);
    void document.fonts.ready.then(() => { if (!disposed) refresh(); });
    refresh();
    return () => {
      disposed = true;
      window.clearTimeout(timer);
      resize.disconnect();
      content.disconnect();
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('pageshow', refresh);
    };
  }, [pathname, hash]);
  return null;
}
