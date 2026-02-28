export type MouseVector = {
  x: number;
  y: number;
};

export type PageMetrics = {
  scrollProgress: number;
  mouseVector: MouseVector;
  isReady: boolean;
};
