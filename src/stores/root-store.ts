import { PageStore } from './page-store';
import { GameStore } from './game-store';

export type RootStore = {
  pageStore: PageStore;
  gameStore: GameStore;
};

export const createRootStore = (): RootStore => ({
  pageStore: new PageStore(),
  gameStore: new GameStore()
});
