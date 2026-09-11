import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

export function useReducedMotion(): boolean { return !!useFramerReducedMotion(); }

/** True while the element is at least partly visible. Used to pause animations offscreen. */
export function useInView<T extends Element>(ref: RefObject<T | null>, rootMargin = '80px'): boolean {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current; if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el); return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

export function usePageVisible(): boolean {
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || document.visibilityState !== 'hidden');
  useEffect(() => { const on = () => setVisible(document.visibilityState !== 'hidden'); document.addEventListener('visibilitychange', on); return () => document.removeEventListener('visibilitychange', on); }, []);
  return visible;
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => { const mq = window.matchMedia(query); const on = () => setMatches(mq.matches); on(); mq.addEventListener('change', on); return () => mq.removeEventListener('change', on); }, [query]);
  return matches;
}
export const useCoarsePointer = () => useMediaQuery('(hover: none), (pointer: coarse)');

/** setTimeout that is cleaned up on unmount and can be reset. Stable identity, safe in effect deps. */
export function useTimer() {
  const ref = useRef<number | null>(null);
  const api = useMemo(() => {
    const clear = () => { if (ref.current !== null) { window.clearTimeout(ref.current); ref.current = null; } };
    const set = (fn: () => void, ms: number) => { clear(); ref.current = window.setTimeout(() => { ref.current = null; fn(); }, ms); };
    return { set, clear };
  }, []);
  useEffect(() => api.clear, [api]);
  return api;
}
