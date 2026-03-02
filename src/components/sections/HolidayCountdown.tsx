import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../../i18n/locale-context';

type CustomCountdownConfig = {
  title: string;
  targetDate: string;
};

const CUSTOM_COUNTDOWN_STORAGE_KEY = 'robbie.custom.countdown.v1';

const formatDateRange = (startIso: string, endIso: string, localeText: string): string => {
  const dateFormat: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Shanghai'
  };

  const startText = new Date(startIso).toLocaleDateString(localeText, dateFormat);
  const endText = new Date(endIso).toLocaleDateString(localeText, dateFormat);

  return `${startText} - ${endText}`;
};

const formatCountdown = (targetTimestamp: number, currentTimestamp: number, locale: 'en' | 'zh'): string => {
  const diffMilliseconds = Math.max(targetTimestamp - currentTimestamp, 0);
  const totalSeconds = Math.floor(diffMilliseconds / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (locale === 'zh') {
    return `${days}天 ${hours}时 ${minutes}分 ${seconds}秒`;
  }

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

export const HolidayCountdown = () => {
  const { locale, message } = useI18n();
  const holidayItems = message.holiday.items;
  const [currentTimestamp, setCurrentTimestamp] = useState(() => Date.now());
  const [isCustomExpanded, setIsCustomExpanded] = useState(false);
  const [isHolidayExpanded, setIsHolidayExpanded] = useState(false);
  const [customTitleInput, setCustomTitleInput] = useState('');
  const [customDateInput, setCustomDateInput] = useState('');
  const [customCountdown, setCustomCountdown] = useState<CustomCountdownConfig | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    const storedRawValue = window.localStorage.getItem(CUSTOM_COUNTDOWN_STORAGE_KEY);
    if (!storedRawValue) {
      return null;
    }
    try {
      const parsedValue = JSON.parse(storedRawValue) as CustomCountdownConfig;
      if (!parsedValue.title || !parsedValue.targetDate) {
        return null;
      }
      return parsedValue;
    } catch {
      return null;
    }
  });
  const localeText = locale === 'zh' ? 'zh-CN' : 'en-US';

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCurrentTimestamp(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    if (!customCountdown) {
      return;
    }
    setCustomTitleInput(customCountdown.title);
    setCustomDateInput(customCountdown.targetDate);
  }, [customCountdown]);

  const upcomingHoliday = useMemo(() => {
    return holidayItems.find((item) => {
      return new Date(item.startIso).getTime() > currentTimestamp;
    });
  }, [currentTimestamp, holidayItems]);

  const countdownText = useMemo(() => {
    if (!upcomingHoliday) {
      return message.holiday.ended;
    }

    return formatCountdown(new Date(upcomingHoliday.startIso).getTime(), currentTimestamp, locale);
  }, [currentTimestamp, locale, message.holiday.ended, upcomingHoliday]);

  const customTargetTimestamp = useMemo(() => {
    if (!customCountdown) {
      return null;
    }
    const parsedTarget = new Date(`${customCountdown.targetDate}T00:00:00`).getTime();
    if (Number.isNaN(parsedTarget)) {
      return null;
    }
    return parsedTarget;
  }, [customCountdown]);

  const customCountdownText = useMemo(() => {
    if (!customCountdown || !customTargetTimestamp) {
      return message.holiday.customEmpty;
    }
    if (customTargetTimestamp <= currentTimestamp) {
      return message.holiday.customExpired;
    }
    return formatCountdown(customTargetTimestamp, currentTimestamp, locale);
  }, [currentTimestamp, customCountdown, customTargetTimestamp, locale, message.holiday.customEmpty, message.holiday.customExpired]);

  const handleStartCustomCountdown = () => {
    const normalizedTitle = customTitleInput.trim();
    const normalizedDate = customDateInput.trim();
    if (!normalizedTitle || !normalizedDate) {
      return;
    }

    const nextConfig: CustomCountdownConfig = {
      title: normalizedTitle,
      targetDate: normalizedDate
    };

    setCustomCountdown(nextConfig);
    window.localStorage.setItem(CUSTOM_COUNTDOWN_STORAGE_KEY, JSON.stringify(nextConfig));
  };

  const handleClearCustomCountdown = () => {
    setCustomTitleInput('');
    setCustomDateInput('');
    setCustomCountdown(null);
    window.localStorage.removeItem(CUSTOM_COUNTDOWN_STORAGE_KEY);
  };

  return (
    <aside className="holiday-countdown" aria-label={message.holiday.label}>
      <div className="holiday-countdown-custom holiday-countdown-panel">
        <div className="holiday-countdown-panel-head">
          <p className="holiday-countdown-label">{message.holiday.customLabel}</p>
          <button type="button" className="holiday-countdown-toggle" onClick={() => setIsCustomExpanded((value) => !value)}>
            {isCustomExpanded ? message.holiday.panelCollapse : message.holiday.panelExpand}
          </button>
        </div>
        {customCountdown ? (
          <p className="holiday-countdown-next">
            {message.holiday.customCountdownPrefix}: {customCountdown.title}
          </p>
        ) : null}
        <p className="holiday-countdown-timer">{customCountdownText}</p>
        <div className={`holiday-countdown-panel-body ${isCustomExpanded ? 'is-expanded' : ''}`}>
          <div className="holiday-countdown-custom-form">
            <label className="holiday-countdown-input-group">
              <span>{message.holiday.customNameLabel}</span>
              <input
                type="text"
                value={customTitleInput}
                placeholder={message.holiday.customNamePlaceholder}
                onChange={(event) => setCustomTitleInput(event.target.value)}
              />
            </label>
            <label className="holiday-countdown-input-group">
              <span>{message.holiday.customDateLabel}</span>
              <input type="date" value={customDateInput} placeholder={message.holiday.customDatePlaceholder} onChange={(event) => setCustomDateInput(event.target.value)} />
            </label>
            <div className="holiday-countdown-actions">
              <button type="button" className="holiday-countdown-start" onClick={handleStartCustomCountdown}>
                {message.holiday.customStartAction}
              </button>
              <button type="button" className="holiday-countdown-clear" onClick={handleClearCustomCountdown}>
                {message.holiday.customClearAction}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="holiday-countdown-panel">
        <div className="holiday-countdown-panel-head">
          <p className="holiday-countdown-label">{message.holiday.label}</p>
          <button type="button" className="holiday-countdown-toggle" onClick={() => setIsHolidayExpanded((value) => !value)}>
            {isHolidayExpanded ? message.holiday.panelCollapse : message.holiday.panelExpand}
          </button>
        </div>
      {upcomingHoliday ? (
        <p className="holiday-countdown-next">
          {message.holiday.nextPrefix}: {upcomingHoliday.name}
        </p>
      ) : null}
      <p className="holiday-countdown-timer">{countdownText}</p>
        <div className={`holiday-countdown-panel-body ${isHolidayExpanded ? 'is-expanded' : ''}`}>
          <ul className="holiday-countdown-list">
            {holidayItems.map((item) => (
              <li key={item.name}>
                <span>{item.name}</span>
                <span>{formatDateRange(item.startIso, item.endIso, localeText)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};
