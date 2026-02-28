import { useEffect } from 'react';

const SCREEN_SELECTOR = '.screen-section';

export const useScreenTransitions = (): void => {
  useEffect(() => {
    const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const screenElements = Array.from(document.querySelectorAll<HTMLElement>(SCREEN_SELECTOR));

    if (screenElements.length === 0) {
      return;
    }

    if (shouldReduceMotion) {
      screenElements.forEach((screenElement) => {
        screenElement.classList.add('is-revealed');
      });
      return;
    }

    const transitionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      {
        threshold: 0.28,
        rootMargin: '-8% 0px -8% 0px'
      }
    );

    screenElements.forEach((screenElement, screenIndex) => {
      if (screenIndex === 0) {
        screenElement.classList.add('is-revealed');
      }
      transitionObserver.observe(screenElement);
    });

    return () => {
      transitionObserver.disconnect();
    };
  }, []);
};
