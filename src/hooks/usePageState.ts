import { useEffect } from 'react';
import { useRootStore } from '../stores/root-store-context';
import { useMouseParallax } from './useMouseParallax';
import { useScrollProgress } from './useScrollProgress';

export const usePageState = () => {
  const { pageStore } = useRootStore();

  useScrollProgress();
  useMouseParallax();

  useEffect(() => {
    pageStore.setReadyState(true);
  }, [pageStore]);

  return {
    isReady: pageStore.isReady
  };
};
