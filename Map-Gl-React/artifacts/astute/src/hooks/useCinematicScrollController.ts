import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

interface Options {
  totalChapters: number;
  cooldownMs?: number;
}

const WHEEL_THRESHOLD = 34;
const TOUCH_THRESHOLD = 46;

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

function isInViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

export default function useCinematicScrollController({
  totalChapters,
  cooldownMs = 1180,
}: Options): {
  activeChapterIndex: number;
  setActiveChapterIndex: (index: number) => void;
  isLocked: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  goToChapter: (direction: 1 | -1) => boolean;
} {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeChapterIndex, setActiveChapterIndexState] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const activeRef = useRef(0);
  const lockedRef = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const unlockTimer = useRef<number | null>(null);

  const lock = useCallback(() => {
    if (prefersReducedMotion()) return;
    lockedRef.current = true;
    setIsLocked(true);
    if (unlockTimer.current) window.clearTimeout(unlockTimer.current);
    unlockTimer.current = window.setTimeout(() => {
      lockedRef.current = false;
      setIsLocked(false);
      unlockTimer.current = null;
    }, cooldownMs);
  }, [cooldownMs]);

  const setActiveChapterIndex = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(totalChapters - 1, index));
    activeRef.current = clamped;
    setActiveChapterIndexState(clamped);
  }, [totalChapters]);

  const goToChapter = useCallback((direction: 1 | -1) => {
    if (lockedRef.current) return false;
    const next = activeRef.current + direction;
    if (next < 0 || next >= totalChapters) return false;
    setActiveChapterIndex(next);
    lock();
    return true;
  }, [lock, setActiveChapterIndex, totalChapters]);

  useEffect(() => {
    activeRef.current = activeChapterIndex;
  }, [activeChapterIndex]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;

    const onWheel = (event: WheelEvent) => {
      if (!isInViewport(element)) return;
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;
      const direction = event.deltaY > 0 ? 1 : -1;
      const canNavigate =
        (direction === 1 && activeRef.current < totalChapters - 1) ||
        (direction === -1 && activeRef.current > 0);
      if (!canNavigate) return;
      event.preventDefault();
      goToChapter(direction);
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartY.current = event.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!isInViewport(element) || touchStartY.current === null) return;
      const y = event.touches[0]?.clientY;
      if (y === undefined) return;
      const delta = touchStartY.current - y;
      if (Math.abs(delta) < TOUCH_THRESHOLD) return;
      const direction = delta > 0 ? 1 : -1;
      const canNavigate =
        (direction === 1 && activeRef.current < totalChapters - 1) ||
        (direction === -1 && activeRef.current > 0);
      if (!canNavigate) return;
      event.preventDefault();
      touchStartY.current = y;
      goToChapter(direction);
    };

    element.addEventListener('wheel', onWheel, { passive: false });
    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      element.removeEventListener('wheel', onWheel);
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
    };
  }, [goToChapter, totalChapters]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const element = containerRef.current;
      if (!element || !isInViewport(element)) return;
      const nextKeys = ['ArrowDown', 'PageDown', ' '];
      const previousKeys = ['ArrowUp', 'PageUp'];
      if (nextKeys.includes(event.key)) {
        if (activeRef.current >= totalChapters - 1) return;
        event.preventDefault();
        goToChapter(1);
      }
      if (previousKeys.includes(event.key)) {
        if (activeRef.current <= 0) return;
        event.preventDefault();
        goToChapter(-1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (unlockTimer.current) window.clearTimeout(unlockTimer.current);
    };
  }, [goToChapter, totalChapters]);

  return {
    activeChapterIndex,
    setActiveChapterIndex,
    isLocked,
    containerRef,
    goToChapter,
  };
}
