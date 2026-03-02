import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../../i18n/locale-context';
import { useWorldStageGameplay } from '../../hooks/useWorldStageGameplay';
import type { FortuneProfileMethod } from '../../hooks/useWorldStageGameplay';
import { useRootStore } from '../../stores/root-store-context';

const worldThemeClasses = ['world-card-grass', 'world-card-desert', 'world-card-ice', 'world-card-sky'] as const;
type WheelToastZone = 'negative' | 'positive' | 'neutral' | 'plus50' | 'minus50';
type WheelToastState = {
  id: number;
  gain: number;
  zone: WheelToastZone;
};

export const WorldSection = () => {
  const { message } = useI18n();
  const {
    gameStore: { setTotalScore }
  } = useRootStore();
  const rewardThreshold = 10;
  const rewardImageSrc = `${import.meta.env.BASE_URL}img/qrcode.jpg`;
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [selectedFortuneMethod, setSelectedFortuneMethod] = useState<FortuneProfileMethod>('zodiac');
  const [selectedFortuneValue, setSelectedFortuneValue] = useState('');
  const [isWheelHistoryModalOpen, setIsWheelHistoryModalOpen] = useState(false);
  const [isScoreHistoryModalOpen, setIsScoreHistoryModalOpen] = useState(false);
  const [isGameplayFocused, setIsGameplayFocused] = useState(false);
  const [ruleModalType, setRuleModalType] = useState<'texas' | 'wheel' | null>(null);
  const [isRewardUnlocked, setIsRewardUnlocked] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isFortuneCongratsOpen, setIsFortuneCongratsOpen] = useState(false);
  const [wheelToast, setWheelToast] = useState<WheelToastState | null>(null);
  const worldSectionRef = useRef<HTMLElement | null>(null);
  const stagePanelRef = useRef<HTMLElement | null>(null);
  const previousTotalScoreRef = useRef(0);
  const previousWheelHistoryIdRef = useRef<number | null>(null);
  const previousFortuneSignatureRef = useRef('');
  const wheelToastTimeoutRef = useRef<number | null>(null);
  const gameplay = useWorldStageGameplay();

  const activeStageDetail = useMemo(() => {
    return message.world.details[activeStageIndex] ?? message.world.details[0];
  }, [activeStageIndex, message.world.details]);
  const compactHighlights = useMemo(() => activeStageDetail.highlights.slice(0, 2), [activeStageDetail.highlights]);
  const activeFortuneSelectConfig = useMemo(() => {
    if (selectedFortuneMethod === 'mbti') {
      return {
        label: message.world.play.mbtiLabel,
        placeholder: message.world.play.mbtiPlaceholder,
        options: message.world.play.mbtiOptions
      };
    }
    if (selectedFortuneMethod === 'constellation') {
      return {
        label: message.world.play.constellationLabel,
        placeholder: message.world.play.constellationPlaceholder,
        options: message.world.play.constellationOptions
      };
    }
    return {
      label: message.world.play.zodiacLabel,
      placeholder: message.world.play.zodiacPlaceholder,
      options: message.world.play.zodiacOptions
    };
  }, [
    message.world.play.constellationLabel,
    message.world.play.constellationOptions,
    message.world.play.constellationPlaceholder,
    message.world.play.mbtiLabel,
    message.world.play.mbtiOptions,
    message.world.play.mbtiPlaceholder,
    message.world.play.zodiacLabel,
    message.world.play.zodiacOptions,
    message.world.play.zodiacPlaceholder,
    selectedFortuneMethod
  ]);

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

  const wheelDialStyle = useMemo(
    () =>
      ({
        '--wheel-gradient': gameplay.wheelGradient
      }) as CSSProperties,
    [gameplay.wheelGradient]
  );

  const getWheelZoneText = (zone: 'negative' | 'positive' | 'neutral' | 'plus50' | 'minus50') => {
    if (zone === 'negative') return message.world.play.wheelZoneNegative;
    if (zone === 'positive') return message.world.play.wheelZonePositive;
    if (zone === 'plus50') return message.world.play.wheelZonePlus50;
    if (zone === 'minus50') return message.world.play.wheelZoneMinus50;
    return message.world.play.wheelZoneNeutral;
  };

  const pickFortuneText = (items: readonly string[], index: number): string => {
    if (items.length === 0) {
      return '';
    }
    const normalizedIndex = ((index % items.length) + items.length) % items.length;
    return items[normalizedIndex];
  };

  const runFocusedAction = (action: () => void) => {
    setIsGameplayFocused(true);
    action();
  };

  useEffect(() => {
    if (!isGameplayFocused) {
      return;
    }

    // Sync viewport and panel scroll when entering focus mode to avoid stale blank area.
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

  useEffect(() => {
    const previousScore = previousTotalScoreRef.current;
    const currentScore = gameplay.totalScore;

    if (previousScore < rewardThreshold && currentScore >= rewardThreshold) {
      setIsRewardUnlocked(true);
      setIsRewardModalOpen(true);
    }

    previousTotalScoreRef.current = currentScore;
  }, [gameplay.totalScore, rewardThreshold]);

  useEffect(() => {
    setTotalScore(gameplay.totalScore);
  }, [gameplay.totalScore, setTotalScore]);

  useEffect(() => {
    if (!isRewardModalOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsRewardModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRewardModalOpen]);

  useEffect(() => {
    const latestWheelHistory = gameplay.wheelHistory[0];
    if (!latestWheelHistory) {
      return;
    }
    if (previousWheelHistoryIdRef.current === latestWheelHistory.id) {
      return;
    }

    previousWheelHistoryIdRef.current = latestWheelHistory.id;
    setWheelToast({
      id: latestWheelHistory.id,
      gain: latestWheelHistory.gain,
      zone: latestWheelHistory.zone
    });

    if (wheelToastTimeoutRef.current) {
      window.clearTimeout(wheelToastTimeoutRef.current);
    }
    wheelToastTimeoutRef.current = window.setTimeout(() => {
      setWheelToast(null);
      wheelToastTimeoutRef.current = null;
    }, 3000);
  }, [gameplay.wheelHistory]);

  useEffect(() => {
    return () => {
      if (wheelToastTimeoutRef.current) {
        window.clearTimeout(wheelToastTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!gameplay.fortune.ready || !gameplay.fortune.profileValue) {
      return;
    }

    const nextSignature = `${gameplay.fortune.method}-${gameplay.fortune.profileValue}-${gameplay.fortune.score10}`;
    if (previousFortuneSignatureRef.current === nextSignature) {
      return;
    }
    previousFortuneSignatureRef.current = nextSignature;

    if (gameplay.fortune.score10 > 5) {
      setIsFortuneCongratsOpen(true);
    }
  }, [gameplay.fortune.method, gameplay.fortune.profileValue, gameplay.fortune.ready, gameplay.fortune.score10]);

  const wheelToastPortal =
    wheelToast && typeof document !== 'undefined'
      ? createPortal(
          <div className={`wheel-score-toast is-${wheelToast.zone}`} role="status" aria-live="polite">
            <strong>{wheelToast.gain > 0 ? `+${wheelToast.gain}` : wheelToast.gain}</strong>
            <span>{getWheelZoneText(wheelToast.zone)}</span>
          </div>,
          document.body
        )
      : null;

  return (
    <>
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
                setIsWheelHistoryModalOpen(false);
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
                  setIsWheelHistoryModalOpen(false);
                  setIsScoreHistoryModalOpen(false);
                }}
              >
                {message.world.play.focusBack}
              </button>
            ) : null}
            <div className="world-stage-score">
              <span>{message.world.play.scoreLabel}</span>
              <strong>{gameplay.totalScore}</strong>
            </div>
            {isGameplayFocused ? (
              <button
                type="button"
                className="world-score-history-trigger"
                onClick={() => setIsScoreHistoryModalOpen(true)}
              >
                {message.world.play.scoreHistoryAction}
              </button>
            ) : null}
          </div>
        </div>

        {!isGameplayFocused ? (
          <div className="world-stage-compact">
            <p>{activeStageDetail.description}</p>
            <ul>
              {compactHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button type="button" className="world-action-button action-enter" onClick={() => setIsGameplayFocused(true)}>
              {message.world.play.enterStageAction}
            </button>
          </div>
        ) : null}

        {isGameplayFocused ? <section className="world-playground" aria-label={message.world.play.title}>
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

              <div className="texas-opponents">
                {gameplay.texasOpponents.map((cards, playerIndex) => (
                  <div key={`${playerIndex + 1}`} className="texas-row">
                    <p>
                      {message.world.play.texasOpponentLabel} {playerIndex + 1}
                      {gameplay.texasWinningOpponentIndices.includes(playerIndex) ? <span className="texas-win-tag">WIN</span> : null}
                      <span className="texas-hand-badge">
                        {gameplay.texasOpponentHandCodes[playerIndex]
                          ? message.world.play.handNames[gameplay.texasOpponentHandCodes[playerIndex] as keyof typeof message.world.play.handNames]
                          : message.world.play.texasHidden}
                      </span>
                    </p>
                    <div className="texas-cards texas-cards-opponent">
                      {cards.map((card, cardIndex) => (
                        <span
                          key={`${card}-${cardIndex}`}
                          className={`${card.includes('♥') || card.includes('♦') ? 'is-red' : ''} ${card === '🂠' ? 'is-hidden' : ''} ${
                            gameplay.texasHighlightOpponentHandIndices[playerIndex]?.includes(cardIndex)
                              ? playerIndex === 0
                                ? 'is-highlight-opponent-1'
                                : 'is-highlight-opponent-2'
                              : ''
                          }`}
                        >
                          {card === '🂠' ? message.world.play.texasHidden : card}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="texas-row texas-row-player-focus">
                <p>
                  {message.world.play.texasPlayerLabel}
                  {gameplay.texasOutcome === 'win' || gameplay.texasOutcome === 'tie' ? <span className="texas-win-tag">WIN</span> : null}
                  <span className="texas-hand-badge">
                    {gameplay.texasOutcome === 'pending' || gameplay.texasOutcome === 'fold'
                      ? message.world.play.texasHidden
                      : message.world.play.handNames[gameplay.texasHandCode]}
                  </span>
                </p>
                <div className="texas-cards texas-cards-player">
                  {gameplay.texasPlayerCards.map((card, index) => (
                    <span
                      key={`${card}-${index}`}
                      className={`${card.includes('♥') || card.includes('♦') ? 'is-red' : ''} ${
                        gameplay.texasHighlightPlayerHandIndices.includes(index) ? 'is-highlight-player' : ''
                      }`}
                    >
                      {card}
                    </span>
                  ))}
                </div>
              </div>

              <div className="texas-action-layout">
                <div className="world-machine-actions texas-action-group texas-action-group-play">
                  <button type="button" className="world-action-button action-deal" onClick={() => runFocusedAction(gameplay.playTexas)}>
                    {message.world.play.texasAction}
                  </button>
                  <button
                    type="button"
                    className="world-action-button world-action-button-alt action-reveal"
                    disabled={!gameplay.texasCanReveal}
                    onClick={gameplay.revealTexas}
                  >
                    {message.world.play.texasRevealAction}
                  </button>
                  <button
                    type="button"
                    className="world-action-button world-action-button-alt action-fold"
                    disabled={!gameplay.texasCanReveal}
                    onClick={gameplay.foldTexas}
                  >
                    {message.world.play.texasFoldAction}
                  </button>
                </div>
                <div className="texas-action-group texas-action-group-meta">
                  <button
                    type="button"
                    className="world-action-button world-action-button-alt world-rule-button action-rule"
                    onClick={() => setRuleModalType('texas')}
                  >
                    {message.world.play.ruleAction}
                  </button>
                </div>
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
                        : gameplay.texasOutcome === 'fold'
                          ? message.world.play.texasOutcomeFold
                          : message.world.play.texasHidden}
                </span>
              </div>
              <div className="world-machine-metrics">
                <span>
                  {message.world.play.lastGain}: {gameplay.texasLastGain > 0 ? `+${gameplay.texasLastGain}` : gameplay.texasLastGain}
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
              <div className="wheel-dial" style={wheelDialStyle}>
                <span className="wheel-rotor" style={{ transform: `translate(-50%, -50%) rotate(${gameplay.wheelAngle}deg)` }} />
                <span className="wheel-center" />
              </div>
              <div className="wheel-action-stack">
                <button
                  type="button"
                  className="world-action-button action-spin"
                  disabled={gameplay.wheelSpinning}
                  onClick={() => runFocusedAction(gameplay.playWheel)}
                >
                  {gameplay.wheelSpinning ? message.world.play.spinning : message.world.play.wheelAction}
                </button>
                <button
                  type="button"
                  className="world-action-button world-action-button-alt wheel-history-trigger action-history"
                  onClick={() => setIsWheelHistoryModalOpen(true)}
                >
                  {message.world.play.wheelHistoryAction}
                </button>
                <button
                  type="button"
                  className="world-action-button world-action-button-alt world-rule-button action-rule"
                  onClick={() => setRuleModalType('wheel')}
                >
                  {message.world.play.ruleAction}
                </button>
              </div>
              <div className="world-machine-metrics">
                <span>
                  {message.world.play.lastGain}: {gameplay.wheelLastGain > 0 ? `+${gameplay.wheelLastGain}` : gameplay.wheelLastGain}
                </span>
                <span>
                  {message.world.play.wheelSpins}: {gameplay.wheelSpins}
                </span>
                <span>
                  {message.world.play.wheelZoneLabel}: {wheelTierText}
                </span>
              </div>
            </div>
          ) : null}

          {activeStageIndex === 2 ? (
            <div className="world-machine world-machine-fortune">
              <label className="fortune-input-row">
                <span>{message.world.play.fortuneMethodLabel}</span>
                <select
                  className="fortune-input"
                  value={selectedFortuneMethod}
                  disabled={gameplay.fortune.locked}
                  onChange={(event) => {
                    setSelectedFortuneMethod(event.target.value as FortuneProfileMethod);
                    setSelectedFortuneValue('');
                  }}
                >
                  {Object.entries(message.world.play.fortuneMethodOptions).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="fortune-input-row">
                <span>{activeFortuneSelectConfig.label}</span>
                <select
                  className="fortune-input"
                  value={selectedFortuneValue}
                  disabled={gameplay.fortune.locked}
                  onChange={(event) => setSelectedFortuneValue(event.target.value)}
                >
                  <option value="">{activeFortuneSelectConfig.placeholder}</option>
                  {Object.entries(activeFortuneSelectConfig.options).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <p className="fortune-hint">{gameplay.fortune.locked ? message.world.play.zodiacLockedHint : message.world.play.zodiacSelectHint}</p>
              <button
                type="button"
                className="world-action-button action-fortune"
                disabled={gameplay.fortune.locked || !selectedFortuneValue}
                onClick={() => runFocusedAction(() => gameplay.playFortune(selectedFortuneValue, selectedFortuneMethod))}
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
                      {message.world.play.fortuneScoreLabel}: {gameplay.fortune.score10}/10
                    </span>
                    <span>
                      {message.world.play.fortuneTierLabel}:{' '}
                      {message.world.play.fortuneTierNames[gameplay.fortune.tier as keyof typeof message.world.play.fortuneTierNames]}
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
                    <span>
                      {message.world.play.fortuneConstellation}: {pickFortuneText(message.world.play.fortuneConstellationPool, gameplay.fortune.constellationIndex)}
                    </span>
                    <span>
                      {message.world.play.fortuneMbti}: {pickFortuneText(message.world.play.fortuneMbtiPool, gameplay.fortune.mbtiIndex)}
                    </span>
                    <span>
                      {message.world.play.fortuneSocialStyle}: {pickFortuneText(message.world.play.fortuneSocialStylePool, gameplay.fortune.socialStyleIndex)}
                    </span>
                    <span>
                      {message.world.play.fortuneZodiacTrend}: {pickFortuneText(message.world.play.fortuneZodiacTrendPool, gameplay.fortune.zodiacTrendIndex)}
                    </span>
                    <span>
                      {message.world.play.fortuneGrowthAction}: {pickFortuneText(message.world.play.fortuneGrowthActionPool, gameplay.fortune.growthActionIndex)}
                    </span>
                  </>
                ) : (
                  <span>{message.world.play.fortuneNotReady}</span>
                )}
              </div>
              <div className="world-machine-metrics">
                <span>
                  {message.world.play.lastGain}: {gameplay.fortune.lastGain > 0 ? `+${gameplay.fortune.lastGain}` : gameplay.fortune.lastGain}
                </span>
              </div>
            </div>
          ) : null}

          {activeStageIndex === 3 ? (
            <div className="world-machine world-machine-jackpot">
              <div className={`jackpot-window ${gameplay.gomokuWinner === 'black' ? 'is-open' : ''}`}>
                <span>{message.world.play.gomokuStatusLabel}</span>
                <strong>
                  {gameplay.gomokuWinner === 'black'
                    ? message.world.play.gomokuOutcomeBlackWin
                    : gameplay.gomokuWinner === 'white'
                      ? message.world.play.gomokuOutcomeWhiteWin
                      : gameplay.gomokuWinner === 'draw'
                        ? message.world.play.gomokuOutcomeDraw
                        : message.world.play.gomokuOutcomeIdle}
                </strong>
                <em>
                  {message.world.play.gomokuMovesLabel}: {gameplay.gomokuMoves}
                </em>
              </div>
              <div className="gomoku-board" style={{ gridTemplateColumns: `repeat(${gameplay.gomokuSize}, minmax(0, 1fr))` }}>
                {gameplay.gomokuBoard.map((stone, index) => (
                  <button
                    key={`gomoku-${index}`}
                    type="button"
                    className={`gomoku-cell ${stone === 'black' ? 'is-black' : stone === 'white' ? 'is-white' : ''}`}
                    disabled={stone !== 'empty' || gameplay.gomokuWinner !== null}
                    onClick={() => runFocusedAction(() => gameplay.playJackpot(index))}
                  />
                ))}
              </div>
              <button type="button" className="world-action-button world-action-button-alt action-reset" onClick={gameplay.resetJackpot}>
                {message.world.play.gomokuResetAction}
              </button>
              <div className="world-machine-metrics">
                <span>
                  {message.world.play.lastGain}: {gameplay.jackpotLastGain > 0 ? `+${gameplay.jackpotLastGain}` : gameplay.jackpotLastGain}
                </span>
                <span>
                  {message.world.play.gomokuStatusLabel}:{' '}
                  {gameplay.gomokuWinner === 'black'
                    ? message.world.play.gomokuOutcomeBlackWin
                    : gameplay.gomokuWinner === 'white'
                      ? message.world.play.gomokuOutcomeWhiteWin
                      : gameplay.gomokuWinner === 'draw'
                        ? message.world.play.gomokuOutcomeDraw
                        : message.world.play.gomokuOutcomeIdle}
                </span>
                <span>
                  {message.world.play.gomokuTurnLabel}:{' '}
                  {gameplay.gomokuCurrentPlayer === 'black' ? message.world.play.gomokuBlackLabel : message.world.play.gomokuWhiteLabel}
                </span>
              </div>
            </div>
          ) : null}
        </section> : null}
      </section>
      {isRewardModalOpen ? (
        <div className="reward-modal-overlay" role="presentation" onClick={() => setIsRewardModalOpen(false)}>
          <section
            className="reward-modal"
            role="dialog"
            aria-modal="true"
            aria-label={message.world.play.rewardTitle}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="reward-modal-close" onClick={() => setIsRewardModalOpen(false)}>
              {message.world.play.rewardClose}
            </button>
            <h4>{message.world.play.rewardTitle}</h4>
            <p>{message.world.play.rewardDescription}</p>
            <img src={rewardImageSrc} alt={message.world.play.rewardTitle} loading="lazy" />
          </section>
        </div>
      ) : null}
      {ruleModalType ? (
        <div className="rule-modal-overlay" role="presentation" onClick={() => setRuleModalType(null)}>
          <section className="rule-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="rule-modal-close" onClick={() => setRuleModalType(null)}>
              {message.world.play.rewardClose}
            </button>
            <h4>{ruleModalType === 'texas' ? message.world.play.texasRuleTitle : message.world.play.wheelRuleTitle}</h4>
            <ul>
              {(ruleModalType === 'texas' ? message.world.play.texasRuleItems : message.world.play.wheelRuleItems).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}
      {isScoreHistoryModalOpen ? (
        <div className="rule-modal-overlay" role="presentation" onClick={() => setIsScoreHistoryModalOpen(false)}>
          <section className="rule-modal score-history-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="rule-modal-close" onClick={() => setIsScoreHistoryModalOpen(false)}>
              {message.world.play.rewardClose}
            </button>
            <h4>{message.world.play.scoreHistoryTitle}</h4>
            {gameplay.scoreHistory.length === 0 ? (
              <span className="score-history-modal-empty">{message.world.play.scoreHistoryEmpty}</span>
            ) : (
              <ul className="score-history-modal-list">
                {gameplay.scoreHistory.map((item) => (
                  <li key={item.id}>
                    <span>{item.time}</span>
                    <span>
                      {message.world.play.scoreHistoryGameLabel}: {message.world.play.scoreSourceLabels[item.source]}
                    </span>
                    <span>{item.gain > 0 ? `+${item.gain}` : item.gain}</span>
                    <span>
                      {message.world.play.scoreHistoryTotalLabel}: {item.total}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : null}
      {isWheelHistoryModalOpen ? (
        <div className="rule-modal-overlay" role="presentation" onClick={() => setIsWheelHistoryModalOpen(false)}>
          <section className="rule-modal wheel-history-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="rule-modal-close" onClick={() => setIsWheelHistoryModalOpen(false)}>
              {message.world.play.rewardClose}
            </button>
            <h4>{message.world.play.wheelHistoryTitle}</h4>
            {gameplay.wheelHistory.length === 0 ? (
              <span className="score-history-modal-empty">{message.world.play.wheelHistoryEmpty}</span>
            ) : (
              <ul className="wheel-history-modal-list">
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
        </div>
      ) : null}
      {isFortuneCongratsOpen ? (
        <div className="rule-modal-overlay" role="presentation" onClick={() => setIsFortuneCongratsOpen(false)}>
          <section className="rule-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="rule-modal-close" onClick={() => setIsFortuneCongratsOpen(false)}>
              {message.world.play.rewardClose}
            </button>
            <h4>{message.world.play.fortuneCongratsTitle}</h4>
            <ul>
              <li>{message.world.play.fortuneCongratsDescription}</li>
              <li>
                {message.world.play.fortuneScoreLabel}: {gameplay.fortune.score10}/10
              </li>
              <li>
                {message.world.play.fortuneTierLabel}:{' '}
                {message.world.play.fortuneTierNames[gameplay.fortune.tier as keyof typeof message.world.play.fortuneTierNames]}
              </li>
            </ul>
          </section>
        </div>
      ) : null}
      {isRewardUnlocked && !isRewardModalOpen ? (
        <button type="button" className="reward-floating-entry" onClick={() => setIsRewardModalOpen(true)}>
          {message.world.play.rewardEntry}
        </button>
      ) : null}
      </section>
      {wheelToastPortal}
    </>
  );
};
