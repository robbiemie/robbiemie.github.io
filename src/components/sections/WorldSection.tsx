import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../../i18n/locale-context';
import { useWorldStageGameplay } from '../../hooks/useWorldStageGameplay';

const worldThemeClasses = ['world-card-grass', 'world-card-desert', 'world-card-ice', 'world-card-sky'] as const;

export const WorldSection = () => {
  const { message } = useI18n();
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [birthdayInput, setBirthdayInput] = useState('');
  const [wheelHistoryVisible, setWheelHistoryVisible] = useState(false);
  const [isGameplayFocused, setIsGameplayFocused] = useState(false);
  const worldSectionRef = useRef<HTMLElement | null>(null);
  const stagePanelRef = useRef<HTMLElement | null>(null);
  const gameplay = useWorldStageGameplay();

  const activeStageDetail = useMemo(() => {
    return message.world.details[activeStageIndex] ?? message.world.details[0];
  }, [activeStageIndex, message.world.details]);

  const wheelTierText = useMemo(() => {
    if (gameplay.wheelZone === 'negative') return message.world.play.wheelZoneNegative;
    if (gameplay.wheelZone === 'positive') return message.world.play.wheelZonePositive;
    if (gameplay.wheelZone === 'plus50') return message.world.play.wheelZonePlus50;
    if (gameplay.wheelZone === 'minus50') return message.world.play.wheelZoneMinus50;
    return message.world.play.wheelZoneNeutral;
  }, [
    gameplay.wheelZone,
    message.world.play.wheelZoneMinus50,
    message.world.play.wheelZoneNegative,
    message.world.play.wheelZoneNeutral,
    message.world.play.wheelZonePlus50,
    message.world.play.wheelZonePositive
  ]);

  const getWheelZoneText = (zone: 'negative' | 'positive' | 'neutral' | 'plus50' | 'minus50') => {
    if (zone === 'negative') return message.world.play.wheelZoneNegative;
    if (zone === 'positive') return message.world.play.wheelZonePositive;
    if (zone === 'plus50') return message.world.play.wheelZonePlus50;
    if (zone === 'minus50') return message.world.play.wheelZoneMinus50;
    return message.world.play.wheelZoneNeutral;
  };

  const runFocusedAction = (action: () => void) => {
    setIsGameplayFocused(true);
    action();
  };

  useEffect(() => {
    // Sync viewport and panel scroll on both enter/exit focus mode to avoid stale blank area.
    const rafId = window.requestAnimationFrame(() => {
      const worldSectionElement = worldSectionRef.current;
      const stagePanelElement = stagePanelRef.current;
      if (!worldSectionElement || !stagePanelElement) {
        return;
      }

      worldSectionElement.classList.add('is-revealed');
      worldSectionElement.scrollIntoView({ behavior: 'auto', block: 'start' });
      stagePanelElement.scrollTo({ top: 0, behavior: 'auto' });

      // Defer one more frame to ensure layout has applied after DOM branch switch.
      window.requestAnimationFrame(() => {
        stagePanelElement.scrollTo({ top: 0, behavior: 'auto' });
      });
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [isGameplayFocused]);

  return (
    <section ref={worldSectionRef} className={`world-section screen-section ${isGameplayFocused ? 'is-game-focus' : ''}`} id="worlds">
      <header className="section-header section-header-world">
        <p className="section-kicker">{message.world.kicker}</p>
        <h2 className="section-title">{message.world.title}</h2>
      </header>

      {!isGameplayFocused ? (
        <div className="world-grid" role="tablist" aria-label={message.world.kicker}>
          {message.world.items.map((item, index) => (
            <button
              key={item.title}
              type="button"
              role="tab"
              aria-selected={activeStageIndex === index}
              className={`world-card ${worldThemeClasses[index] ?? worldThemeClasses[0]} ${activeStageIndex === index ? 'is-active' : ''}`}
              onClick={() => {
                setActiveStageIndex(index);
                setWheelHistoryVisible(false);
              }}
            >
              <div className="world-badge">{message.world.stageLabel}</div>
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
            </button>
          ))}
        </div>
      ) : null}

      <section ref={stagePanelRef} className="world-stage-panel" role="tabpanel" aria-label={message.world.detailLabel}>
        <div className="world-stage-panel-top">
          <div>
            <p className="world-stage-panel-kicker">{message.world.detailLabel}</p>
            <h3>{activeStageDetail.title}</h3>
          </div>
          <div className="world-stage-top-actions">
            {isGameplayFocused ? (
              <button
                type="button"
                className="world-focus-back"
                onClick={() => {
                  setIsGameplayFocused(false);
                  setWheelHistoryVisible(false);
                }}
              >
                {message.world.play.focusBack}
              </button>
            ) : null}
            <div className="world-stage-score">
              <span>{message.world.play.scoreLabel}</span>
              <strong>{gameplay.totalScore}</strong>
            </div>
          </div>
        </div>

        {!isGameplayFocused ? (
          <>
            <p>{activeStageDetail.description}</p>
            <ul>
              {activeStageDetail.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        ) : null}

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
                <button type="button" className="world-action-button" onClick={() => runFocusedAction(gameplay.playTexas)}>
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
              <div className="wheel-dial">
                <span className="wheel-rotor" style={{ transform: `translate(-50%, -50%) rotate(${gameplay.wheelAngle}deg)` }} />
                <span className="wheel-center" />
              </div>
              <div className="wheel-action-stack">
                <button
                  type="button"
                  className="world-action-button"
                  disabled={gameplay.wheelSpinning}
                  onClick={() => runFocusedAction(gameplay.playWheel)}
                >
                  {gameplay.wheelSpinning ? message.world.play.spinning : message.world.play.wheelAction}
                </button>
                <button
                  type="button"
                  className="world-action-button world-action-button-alt wheel-history-trigger"
                  onClick={() => setWheelHistoryVisible((visible) => !visible)}
                >
                  {message.world.play.wheelHistoryAction}
                </button>
              </div>
              <div className="wheel-rule-board">
                <p>{message.world.play.wheelRuleTitle}</p>
                <div className="wheel-rule-grid">
                  <span className="wheel-rule-item">
                    <i className="wheel-zone-chip zone-negative" />
                    {message.world.play.wheelZoneNegative}: -5,-5,-10,-10
                  </span>
                  <em>{message.world.play.wheelRateLabel} 20%</em>
                  <span className="wheel-rule-item">
                    <i className="wheel-zone-chip zone-positive" />
                    {message.world.play.wheelZonePositive}: +5,+5,+10,+10
                  </span>
                  <em>{message.world.play.wheelRateLabel} 20%</em>
                  <span className="wheel-rule-item">
                    <i className="wheel-zone-chip zone-neutral" />
                    {message.world.play.wheelZoneNeutral}: 0
                  </span>
                  <em>{message.world.play.wheelRateLabel} 58%</em>
                  <span className="wheel-rule-item">
                    <i className="wheel-zone-chip zone-plus50" />
                    {message.world.play.wheelZonePlus50}: +50
                  </span>
                  <em>{message.world.play.wheelRateLabel} 0.5%</em>
                  <span className="wheel-rule-item">
                    <i className="wheel-zone-chip zone-minus50" />
                    {message.world.play.wheelZoneMinus50}: -50
                  </span>
                  <em>{message.world.play.wheelRateLabel} 1.5%</em>
                </div>
              </div>
              <div className="world-machine-metrics">
                <span>
                  {message.world.play.lastGain}: {gameplay.wheelLastGain > 0 ? `+${gameplay.wheelLastGain}` : gameplay.wheelLastGain}
                </span>
                <span>
                  {message.world.play.wheelSpins}: {gameplay.wheelSpins}
                </span>
                <span>
                  {message.world.play.wheelStreak}: {gameplay.wheelStreak}
                </span>
                <span>
                  {message.world.play.wheelZoneLabel}: {wheelTierText}
                </span>
                <span>
                  {message.world.play.wheelRateLabel}: {gameplay.wheelZoneProbability}%
                </span>
              </div>
              {wheelHistoryVisible ? (
                <section className="wheel-history">
                  <p>{message.world.play.wheelHistoryTitle}</p>
                  {gameplay.wheelHistory.length === 0 ? (
                    <span className="wheel-history-empty">{message.world.play.wheelHistoryEmpty}</span>
                  ) : (
                    <ul>
                      {gameplay.wheelHistory.map((item) => (
                        <li key={item.id}>
                          <span>#{item.spin}</span>
                          <span>{item.time}</span>
                          <span>
                            {message.world.play.wheelHistoryZone}: {getWheelZoneText(item.zone)}
                          </span>
                          <span>{item.gain > 0 ? `+${item.gain}` : item.gain}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ) : null}
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
              <button
                type="button"
                className="world-action-button"
                onClick={() => runFocusedAction(() => gameplay.playFortune(birthdayInput))}
              >
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
              <button type="button" className="world-action-button" onClick={() => runFocusedAction(gameplay.playJackpot)}>
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
