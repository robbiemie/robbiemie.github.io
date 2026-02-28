import { useEffect } from 'react';
import { useRootStore } from '../stores/root-store-context';
import { useMouseParallax } from './useMouseParallax';
import { useScreenTransitions } from './useScreenTransitions';
import { useScrollProgress } from './useScrollProgress';

export const usePageState = () => {
  const { pageStore } = useRootStore();

  useScrollProgress();
  useMouseParallax();
  useScreenTransitions();

  useEffect(() => {
    pageStore.setReadyState(true);
  }, [pageStore]);

  return {
    isReady: pageStore.isReady
  };
};
