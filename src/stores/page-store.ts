import { makeAutoObservable } from 'mobx';
import type { MouseVector, PageMetrics } from '../types/page-metrics';

const DEFAULT_METRICS: PageMetrics = {
  scrollProgress: 0,
  mouseVector: { x: 0, y: 0 },
  isReady: false
};

export class PageStore {
  public scrollProgress = DEFAULT_METRICS.scrollProgress;
  public mouseVector = DEFAULT_METRICS.mouseVector;
  public isReady = DEFAULT_METRICS.isReady;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public setScrollProgress(nextValue: number): void {
    this.scrollProgress = Math.min(Math.max(nextValue, 0), 1);
  }

  public setMouseVector(nextVector: MouseVector): void {
    this.mouseVector = nextVector;
  }

  public setReadyState(nextState: boolean): void {
    this.isReady = nextState;
  }
}
