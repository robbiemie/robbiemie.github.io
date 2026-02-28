import { observer } from 'mobx-react-lite';
import { HeroLinkIcon } from '../common/HeroLinkIcon';
import { useI18n } from '../../i18n/locale-context';
import { useRootStore } from '../../stores/root-store-context';
import { AnimatedSignature } from '../effects/AnimatedSignature';
import { GameVisualPanel } from './GameVisualPanel';
import { HolidayCountdown } from './HolidayCountdown';

export const HeroSection = observer(() => {
  const { message } = useI18n();
  const {
    pageStore: { scrollProgress },
    gameStore: { totalScore }
  } = useRootStore();
  const isResourceUnlocked = totalScore > 5;

  return (
    <section className="hero-section screen-section" id="home">
      <div className="hero-copy" style={{ transform: `translateY(${scrollProgress * -40}px)` }}>
        <AnimatedSignature />
        <h1 className="hero-heading">
          {message.hero.titleLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p className="hero-description">{message.hero.description}</p>
        <HolidayCountdown />
        <div className="hero-link-group">
          <a className="hero-link" href="#worlds">
            <HeroLinkIcon name="start" />
            {message.hero.startButton}
          </a>
          {isResourceUnlocked ? (
            <>
              <a
                className="hero-link hero-link-secondary"
                href="https://www.yangoogle.com/keep-learning"
                target="_blank"
                rel="noreferrer"
              >
                <HeroLinkIcon name="knowledge" />
                {message.hero.knowledgeButton}
              </a>
              <a
                className="hero-link hero-link-secondary"
                href="https://blog.csdn.net/u013243347"
                target="_blank"
                rel="noreferrer"
              >
                <HeroLinkIcon name="blog" />
                {message.hero.blogButton}
              </a>
              <a
                className="hero-link hero-link-secondary"
                href="https://github.com/robbiemie"
                target="_blank"
                rel="noreferrer"
              >
                <HeroLinkIcon name="github" />
                {message.hero.githubButton}
              </a>
            </>
          ) : (
            <>
              <span className="hero-link hero-link-secondary is-locked" aria-disabled="true" title={message.hero.lockedHint}>
                <span className="hero-link-label">
                  <HeroLinkIcon name="knowledge" />
                  {message.hero.knowledgeButton}
                </span>
                <em className="hero-link-lock-tip">{message.hero.lockedHint}</em>
              </span>
              <span className="hero-link hero-link-secondary is-locked" aria-disabled="true" title={message.hero.lockedHint}>
                <span className="hero-link-label">
                  <HeroLinkIcon name="blog" />
                  {message.hero.blogButton}
                </span>
                <em className="hero-link-lock-tip">{message.hero.lockedHint}</em>
              </span>
              <span className="hero-link hero-link-secondary is-locked" aria-disabled="true" title={message.hero.lockedHint}>
                <span className="hero-link-label">
                  <HeroLinkIcon name="github" />
                  {message.hero.githubButton}
                </span>
                <em className="hero-link-lock-tip">{message.hero.lockedHint}</em>
              </span>
            </>
          )}
        </div>
      </div>
      <div className="hero-visual-wrap">
        <span className="hero-sun" aria-hidden="true" />
        <GameVisualPanel className="knowledge-visual-hero" />
        <span className="hero-border-walker" aria-hidden="true">
          <span className="hero-border-walker-pack" />
        </span>
      </div>
    </section>
  );
});
