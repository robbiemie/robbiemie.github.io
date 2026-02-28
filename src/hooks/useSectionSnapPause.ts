import { useEffect, useRef } from 'react';

const SCREEN_SELECTOR = '.screen-section';
const SCROLL_LOCK_DURATION = 760;
const SNAP_SETTLE_DURATION = 520;

const clampIndex = (value: number, max: number): number => {
  return Math.min(Math.max(value, 0), max);
};

const getNearestSectionIndex = (sections: HTMLElement[]): number => {
  const currentScrollTop = window.scrollY;
  let bestIndex = 0;
  let smallestDistance = Number.POSITIVE_INFINITY;

  sections.forEach((section, index) => {
    const distance = Math.abs(section.offsetTop - currentScrollTop);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
};

export const useSectionSnapPause = (): void => {
  const isLockedRef = useRef(false);
  const unlockTimerRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileViewport = window.matchMedia('(max-width: 960px), (pointer: coarse)').matches;
    if (shouldReduceMotion || isMobileViewport) {
      return;
    }

    const sections = Array.from(document.querySelectorAll<HTMLElement>(SCREEN_SELECTOR));
    if (sections.length === 0) {
      return;
    }

    const maxIndex = sections.length - 1;

    const lockScroll = () => {
      isLockedRef.current = true;
      if (unlockTimerRef.current) {
        window.clearTimeout(unlockTimerRef.current);
      }
      unlockTimerRef.current = window.setTimeout(() => {
        isLockedRef.current = false;
      }, SCROLL_LOCK_DURATION);
    };

    const scrollToIndex = (nextIndex: number) => {
      const safeIndex = clampIndex(nextIndex, maxIndex);
      const targetTop = sections[safeIndex].offsetTop;
      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });

      if (settleTimerRef.current) {
        window.clearTimeout(settleTimerRef.current);
      }
      settleTimerRef.current = window.setTimeout(() => {
        window.scrollTo({
          top: targetTop,
          behavior: 'auto'
        });
      }, SNAP_SETTLE_DURATION);

      lockScroll();
    };

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 5) {
        return;
      }

      event.preventDefault();
      if (isLockedRef.current) {
        return;
      }

      const currentIndex = getNearestSectionIndex(sections);
      const direction = event.deltaY > 0 ? 1 : -1;
      const nextIndex = clampIndex(currentIndex + direction, maxIndex);

      if (nextIndex !== currentIndex) {
        scrollToIndex(nextIndex);
      }
    };

    const handleKeydown = (event: KeyboardEvent) => {
      const downKeys = ['ArrowDown', 'PageDown', ' '];
      const upKeys = ['ArrowUp', 'PageUp'];
      if (!downKeys.includes(event.key) && !upKeys.includes(event.key)) {
        return;
      }

      event.preventDefault();
      if (isLockedRef.current) {
        return;
      }

      const direction = downKeys.includes(event.key) ? 1 : -1;
      const currentIndex = getNearestSectionIndex(sections);
      const nextIndex = clampIndex(currentIndex + direction, maxIndex);

      if (nextIndex !== currentIndex) {
        scrollToIndex(nextIndex);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeydown);
      if (unlockTimerRef.current) {
        window.clearTimeout(unlockTimerRef.current);
      }
      if (settleTimerRef.current) {
        window.clearTimeout(settleTimerRef.current);
      }
    };
  }, []);
};
