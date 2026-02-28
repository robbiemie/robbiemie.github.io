import { createContext, useContext } from 'react';
import type { PropsWithChildren } from 'react';
import type { RootStore } from './root-store';

const RootStoreContext = createContext<RootStore | null>(null);

export const RootStoreProvider = ({ value, children }: PropsWithChildren<{ value: RootStore }>) => (
  <RootStoreContext.Provider value={value}>{children}</RootStoreContext.Provider>
);

export const useRootStore = (): RootStore => {
  const store = useContext(RootStoreContext);
  if (!store) {
    throw new Error('RootStoreProvider is missing in component tree.');
  }

  return store;
};
