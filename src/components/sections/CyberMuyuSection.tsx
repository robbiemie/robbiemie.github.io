import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { useI18n } from '../../i18n/locale-context';

type MeritBurst = {
  id: number;
  x: number;
  y: number;
  text: string;
  combo: boolean;
};

export const CyberMuyuSection = () => {
  const { message } = useI18n();
  const rewardImageSrc = `${import.meta.env.BASE_URL}img/qrcode.jpg`;
  const rewardKnockThreshold = 100;
  const comboWindowMs = 850;
  const comboResetDelayMs = 1250;
  const [meritTotal, setMeritTotal] = useState(0);
  const [isKnocking, setIsKnocking] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [isComboPulse, setIsComboPulse] = useState(false);
  const [bursts, setBursts] = useState<readonly MeritBurst[]>([]);
  const [isRewardUnlocked, setIsRewardUnlocked] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const burstIdRef = useRef(0);
  const lastKnockAtRef = useRef(0);
  const comboCountRef = useRef(0);
  const comboResetTimerRef = useRef<number | null>(null);
  const timerRefs = useRef<number[]>([]);

  useEffect(() => {
    if (isRewardUnlocked || meritTotal < rewardKnockThreshold) {
      return;
    }
    setIsRewardUnlocked(true);
    setIsRewardModalOpen(true);
  }, [isRewardUnlocked, meritTotal, rewardKnockThreshold]);

  useEffect(() => {
    if (!isRewardModalOpen) {
      return;
    }

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsRewardModalOpen(false);
      }
    };
    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  }, [isRewardModalOpen]);

  useEffect(() => {
    return () => {
      timerRefs.current.forEach((timerId) => {
        window.clearTimeout(timerId);
      });
    };
  }, []);

  const queueTimeout = (handler: () => void, delay: number) => {
    const timerId = window.setTimeout(() => {
      handler();
      timerRefs.current = timerRefs.current.filter((item) => item !== timerId);
    }, delay);
    timerRefs.current = [...timerRefs.current, timerId];
  };

  const queueComboReset = () => {
    if (comboResetTimerRef.current) {
      window.clearTimeout(comboResetTimerRef.current);
      timerRefs.current = timerRefs.current.filter((timerId) => timerId !== comboResetTimerRef.current);
    }

    const timerId = window.setTimeout(() => {
      comboCountRef.current = 0;
      setComboCount(0);
      comboResetTimerRef.current = null;
      timerRefs.current = timerRefs.current.filter((item) => item !== timerId);
    }, comboResetDelayMs);

    comboResetTimerRef.current = timerId;
    timerRefs.current = [...timerRefs.current, timerId];
  };

  const handleKnock = (event: MouseEvent<HTMLButtonElement>) => {
    const now = Date.now();
    const isComboHit = now - lastKnockAtRef.current <= comboWindowMs;
    const nextComboCount = isComboHit ? comboCountRef.current + 1 : 1;
    comboCountRef.current = nextComboCount;
    setComboCount(nextComboCount);
    setIsComboPulse(true);
    queueTimeout(() => {
      setIsComboPulse(false);
    }, 220);
    queueComboReset();
    lastKnockAtRef.current = now;

    const rect = event.currentTarget.getBoundingClientRect();
    const burstId = burstIdRef.current + 1;
    burstIdRef.current = burstId + 1;

    const burstX = event.clientX - rect.left;
    const burstY = event.clientY - rect.top;

    setMeritTotal((value) => value + 1);
    setIsKnocking(true);
    setBursts((items) => {
      const baseBurst: MeritBurst = {
        id: burstId,
        x: burstX,
        y: burstY,
        text: message.muyu.burstText,
        combo: false
      };
      const nextBursts: MeritBurst[] = [baseBurst];

      if (nextComboCount >= 2) {
        nextBursts.push({
          id: burstId + 1,
          x: rect.width * 0.5,
          y: rect.height * 0.28,
          text: `${message.muyu.comboBurstText} x${nextComboCount}`,
          combo: true
        });
      }

      return [...items, ...nextBursts].slice(-16);
    });

    queueTimeout(() => {
      setIsKnocking(false);
    }, 160);

    queueTimeout(() => {
      setBursts((items) => items.filter((item) => item.id !== burstId));
    }, 900);
  };

  return (
    <section className="muyu-section screen-section" id="muyu">
      <header className="section-header section-header-muyu">
        <p className="section-kicker">{message.muyu.kicker}</p>
        <h2 className="section-title">{message.muyu.title}</h2>
      </header>

      <div className="muyu-layout">
        <div className="muyu-copy">
          <p className="muyu-description">{message.muyu.description}</p>
          <p className="muyu-tip">{message.muyu.tip}</p>
          <div className="muyu-merit-board">
            <span>{message.muyu.totalLabel}</span>
            <strong>{meritTotal}</strong>
          </div>
          <p className="muyu-reward-hint">{message.muyu.rewardHint}</p>
        </div>

        <div className="muyu-stage" aria-live="polite">
          <span className={`muyu-stick ${isKnocking ? 'is-knocking' : ''}`} aria-hidden="true" />
          <button
            type="button"
            className={`cyber-muyu ${isKnocking ? 'is-knocking' : ''}`}
            onClick={handleKnock}
            onMouseDown={(event) => event.preventDefault()}
          >
            <span className="cyber-muyu-groove" aria-hidden="true" />
            <span className="cyber-muyu-core" aria-hidden="true" />
          </button>

          <span className={`muyu-combo ${comboCount >= 2 ? 'is-visible' : ''} ${isComboPulse ? 'is-pulse' : ''}`}>
            {message.muyu.comboLabel} x{comboCount}
          </span>

          {bursts.map((burst) => (
            <span key={burst.id} className={`muyu-burst ${burst.combo ? 'is-combo' : ''}`} style={{ left: burst.x, top: burst.y }}>
              {burst.text}
            </span>
          ))}
        </div>
      </div>

      {isRewardModalOpen ? (
        <div className="reward-modal-overlay" role="presentation" onClick={() => setIsRewardModalOpen(false)}>
          <section className="reward-modal" role="dialog" aria-modal="true" aria-label={message.muyu.rewardTitle} onClick={(event) => event.stopPropagation()}>
            <button type="button" className="reward-modal-close" onClick={() => setIsRewardModalOpen(false)}>
              {message.muyu.rewardClose}
            </button>
            <h4>{message.muyu.rewardTitle}</h4>
            <p>{message.muyu.rewardDescription}</p>
            <img src={rewardImageSrc} alt={message.muyu.rewardTitle} loading="lazy" />
          </section>
        </div>
      ) : null}

      {isRewardUnlocked && !isRewardModalOpen ? (
        <button type="button" className="reward-floating-entry" onClick={() => setIsRewardModalOpen(true)}>
          {message.muyu.rewardEntry}
        </button>
      ) : null}
    </section>
  );
};
