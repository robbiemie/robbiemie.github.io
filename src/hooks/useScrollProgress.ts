import { useEffect } from 'react';
import { useRootStore } from '../stores/root-store-context';

export const useScrollProgress = (): void => {
  const {
    pageStore: { setScrollProgress }
  } = useRootStore();

  useEffect(() => {
    const updateScrollProgress = () => {
      const documentElement = document.documentElement;
      const maxScrollableDistance = documentElement.scrollHeight - window.innerHeight;
      if (maxScrollableDistance <= 0) {
        setScrollProgress(0);
        return;
      }

      setScrollProgress(window.scrollY / maxScrollableDistance);
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
    };
  }, [setScrollProgress]);
};
