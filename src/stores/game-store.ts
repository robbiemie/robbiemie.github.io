import { makeAutoObservable } from 'mobx';

export class GameStore {
  public totalScore = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public setTotalScore(nextScore: number): void {
    this.totalScore = nextScore;
  }
}
