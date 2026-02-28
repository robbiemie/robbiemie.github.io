import { useMemo, useState } from 'react';
import { useI18n } from '../../i18n/locale-context';
import { useWorldStageGameplay } from '../../hooks/useWorldStageGameplay';

const worldThemeClasses = ['world-card-grass', 'world-card-desert', 'world-card-ice', 'world-card-sky'] as const;

export const WorldSection = () => {
  const { message } = useI18n();
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [birthdayInput, setBirthdayInput] = useState('');
  const gameplay = useWorldStageGameplay();

  const activeStageDetail = useMemo(() => {
    return message.world.details[activeStageIndex] ?? message.world.details[0];
  }, [activeStageIndex, message.world.details]);

  return (
    <section className="world-section screen-section" id="worlds">
      <header className="section-header section-header-world">
        <p className="section-kicker">{message.world.kicker}</p>
        <h2 className="section-title">{message.world.title}</h2>
      </header>

      <div className="world-grid" role="tablist" aria-label={message.world.kicker}>
        {message.world.items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            role="tab"
            aria-selected={activeStageIndex === index}
            className={`world-card ${worldThemeClasses[index] ?? worldThemeClasses[0]} ${activeStageIndex === index ? 'is-active' : ''}`}
            onClick={() => setActiveStageIndex(index)}
          >
            <div className="world-badge">{message.world.stageLabel}</div>
            <h3>{item.title}</h3>
            <p>{item.subtitle}</p>
          </button>
        ))}
      </div>

      <section className="world-stage-panel" role="tabpanel" aria-label={message.world.detailLabel}>
        <div className="world-stage-panel-top">
          <div>
            <p className="world-stage-panel-kicker">{message.world.detailLabel}</p>
            <h3>{activeStageDetail.title}</h3>
          </div>
          <div className="world-stage-score">
            <span>{message.world.play.scoreLabel}</span>
            <strong>{gameplay.totalScore}</strong>
          </div>
        </div>

        <p>{activeStageDetail.description}</p>
        <ul>
          {activeStageDetail.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <section className="world-playground" aria-label={message.world.play.title}>
          <p className="world-playground-kicker">{message.world.play.title}</p>

          {activeStageIndex === 0 ? (
            <div className="world-machine world-machine-texas">
              <div className="texas-row">
                <p>{message.world.play.texasBoardLabel}</p>
                <div className="texas-cards">
                  {gameplay.texasBoardCards.map((card, index) => (
                    <span key={`${card}-${index}`} className={card.includes('♥') || card.includes('♦') ? 'is-red' : ''}>
                      {card}
                    </span>
                  ))}
                </div>
              </div>

              <div className="texas-row">
                <p>{message.world.play.texasPlayerLabel}</p>
                <div className="texas-cards texas-cards-player">
                  {gameplay.texasPlayerCards.map((card, index) => (
                    <span key={`${card}-${index}`} className={card.includes('♥') || card.includes('♦') ? 'is-red' : ''}>
                      {card}
                    </span>
                  ))}
                </div>
              </div>

              <div className="texas-opponents">
                {gameplay.texasOpponents.map((cards, playerIndex) => (
                  <div key={`${playerIndex + 1}`} className="texas-row">
                    <p>
                      {message.world.play.texasOpponentLabel} {playerIndex + 1}
                    </p>
                    <div className="texas-cards texas-cards-opponent">
                      {cards.map((card, cardIndex) => (
                        <span
                          key={`${card}-${cardIndex}`}
                          className={card.includes('♥') || card.includes('♦') ? 'is-red' : card === '🂠' ? 'is-hidden' : ''}
                        >
                          {card === '🂠' ? message.world.play.texasHidden : card}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="world-machine-actions">
                <button type="button" className="world-action-button" onClick={gameplay.playTexas}>
                  {message.world.play.texasAction}
                </button>
                <button
                  type="button"
                  className="world-action-button world-action-button-alt"
                  disabled={!gameplay.texasCanReveal}
                  onClick={gameplay.revealTexas}
                >
                  {message.world.play.texasRevealAction}
                </button>
              </div>

              <div className="texas-summary">
                <span>
                  {message.world.play.texasResult}: {message.world.play.handNames[gameplay.texasHandCode]}
                </span>
                <span>
                  {message.world.play.texasOutcome}:{' '}
                  {gameplay.texasOutcome === 'win'
                    ? message.world.play.texasOutcomeWin
                    : gameplay.texasOutcome === 'lose'
                      ? message.world.play.texasOutcomeLose
                      : gameplay.texasOutcome === 'tie'
                        ? message.world.play.texasOutcomeTie
                        : message.world.play.texasHidden}
                </span>
              </div>
              <div className="world-machine-metrics">
                <span>
                  {message.world.play.lastGain}: +{gameplay.texasLastGain}
                </span>
                <span>
                  {message.world.play.texasHands}: {gameplay.texasHands}
                </span>
                <span>
                  {message.world.play.texasResult}: {message.world.play.handNames[gameplay.texasHandCode]}
                </span>
              </div>
            </div>
          ) : null}

          {activeStageIndex === 1 ? (
            <div className="world-machine world-machine-wheel">
              <div className="wheel-dial" style={{ transform: `rotate(${gameplay.wheelAngle}deg)` }}>
                <span />
              </div>
              <button
                type="button"
                className="world-action-button"
                disabled={gameplay.wheelSpinning}
                onClick={gameplay.playWheel}
              >
                {gameplay.wheelSpinning ? message.world.play.spinning : message.world.play.wheelAction}
              </button>
              <div className="world-machine-metrics">
                <span>
                  {message.world.play.lastGain}: +{gameplay.wheelLastGain}
                </span>
                <span>
                  {message.world.play.wheelSpins}: {gameplay.wheelSpins}
                </span>
                <span>
                  {message.world.play.wheelStreak}: {gameplay.wheelStreak}
                </span>
              </div>
            </div>
          ) : null}

          {activeStageIndex === 2 ? (
            <div className="world-machine world-machine-fortune">
              <label className="fortune-input-row">
                <span>{message.world.play.birthdayLabel}</span>
                <input
                  className="fortune-input"
                  type="date"
                  value={birthdayInput}
                  onChange={(event) => setBirthdayInput(event.target.value)}
                  placeholder={message.world.play.birthdayPlaceholder}
                />
              </label>
              <button type="button" className="world-action-button" onClick={() => gameplay.playFortune(birthdayInput)}>
                {message.world.play.fortuneAction}
              </button>
              <div className="fortune-panel">
                {gameplay.fortune.ready ? (
                  <>
                    <span>
                      {message.world.play.fortuneSummary}: {gameplay.fortune.overall}
                    </span>
                    <span>
                      {message.world.play.fortuneCareer}: {gameplay.fortune.career}
                    </span>
                    <span>
                      {message.world.play.fortuneLove}: {gameplay.fortune.love}
                    </span>
                    <span>
                      {message.world.play.fortuneWealth}: {gameplay.fortune.wealth}
                    </span>
                    <span>
                      {message.world.play.fortuneLuckyNumber}: {gameplay.fortune.luckyNumber}
                    </span>
                    <span>
                      {message.world.play.fortuneLuckyColor}: {gameplay.fortune.luckyColor}
                    </span>
                    <span>
                      {message.world.play.fortuneLuckyTime}: {gameplay.fortune.luckyTime}
                    </span>
                  </>
                ) : (
                  <span>{message.world.play.fortuneNotReady}</span>
                )}
              </div>
              <div className="world-machine-metrics">
                <span>
                  {message.world.play.lastGain}: +{gameplay.fortune.lastGain}
                </span>
              </div>
            </div>
          ) : null}

          {activeStageIndex === 3 ? (
            <div className="world-machine world-machine-jackpot">
              <div className={`jackpot-window ${gameplay.jackpotWindowOpen ? 'is-open' : ''}`}>
                <span>{message.world.play.jackpotWindow}</span>
                <strong>
                  {gameplay.jackpotWindowOpen ? message.world.play.jackpotOpen : message.world.play.jackpotClosed}
                </strong>
                <em>{gameplay.jackpotCountdown}s</em>
              </div>
              <button type="button" className="world-action-button" onClick={gameplay.playJackpot}>
                {message.world.play.jackpotAction}
              </button>
              <div className="world-machine-metrics">
                <span>
                  {message.world.play.lastGain}: +{gameplay.jackpotLastGain}
                </span>
              </div>
            </div>
          ) : null}
        </section>
      </section>
    </section>
  );
};
