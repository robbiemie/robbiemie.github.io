import { useEffect } from 'react';
import { useRootStore } from '../stores/root-store-context';

const NORMALIZATION_FACTOR = 0.5;

export const useMouseParallax = (): void => {
  const {
    pageStore: { setMouseVector }
  } = useRootStore();

  useEffect(() => {
    const updateMouseVector = (event: MouseEvent) => {
      const normalizedX = event.clientX / window.innerWidth - NORMALIZATION_FACTOR;
      const normalizedY = event.clientY / window.innerHeight - NORMALIZATION_FACTOR;
      setMouseVector({ x: normalizedX, y: normalizedY });
    };

    window.addEventListener('mousemove', updateMouseVector, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updateMouseVector);
    };
  }, [setMouseVector]);
};
