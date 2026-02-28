import { PageStore } from './page-store';

export type RootStore = {
  pageStore: PageStore;
};

export const createRootStore = (): RootStore => ({
  pageStore: new PageStore()
});
