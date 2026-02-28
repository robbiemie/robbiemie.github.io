import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../stores/root-store-context';
import { AnimatedSignature } from '../effects/AnimatedSignature';
import { GameVisualPanel } from './GameVisualPanel';

export const HeroSection = observer(() => {
  const {
    pageStore: { scrollProgress }
  } = useRootStore();

  return (
    <section className="hero-section screen-section" id="home">
      <div className="hero-sky-decor" aria-hidden="true">
        <span className="hero-sun" />
      </div>
      <div className="hero-copy" style={{ transform: `translateY(${scrollProgress * -40}px)` }}>
        <AnimatedSignature />
        <h1 className="hero-title">
          <span>Jump Into</span>
          <span>Your Next</span>
          <span>Bright World</span>
        </h1>
        <div className="hero-link-group">
          <a className="hero-link" href="#worlds">
            Start Adventure
          </a>
          <a
            className="hero-link hero-link-secondary"
            href="https://www.yangoogle.com/keep-learning"
            target="_blank"
            rel="noreferrer"
          >
            Knowledge Base
          </a>
        </div>
      </div>
      <div className="hero-visual-wrap">
        <GameVisualPanel className="knowledge-visual-hero" />
        <span className="hero-border-walker" aria-hidden="true">
          <span className="hero-border-walker-pack" />
        </span>
      </div>
    </section>
  );
});
