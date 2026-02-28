import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../../i18n/locale-context';

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
  const localeText = locale === 'zh' ? 'zh-CN' : 'en-US';

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCurrentTimestamp(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

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

  return (
    <aside className="holiday-countdown" aria-label={message.holiday.label}>
      <p className="holiday-countdown-label">{message.holiday.label}</p>
      {upcomingHoliday ? (
        <p className="holiday-countdown-next">
          {message.holiday.nextPrefix}: {upcomingHoliday.name}
        </p>
      ) : null}
      <p className="holiday-countdown-timer">{countdownText}</p>
      <ul className="holiday-countdown-list">
        {holidayItems.map((item) => (
          <li key={item.name}>
            <span>{item.name}</span>
            <span>{formatDateRange(item.startIso, item.endIso, localeText)}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};
