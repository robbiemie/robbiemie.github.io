import { useEffect, useMemo, useState } from 'react';

type HolidayItem = {
  name: string;
  startIso: string;
  endIso: string;
};

const CHINA_2026_HOLIDAYS: HolidayItem[] = [
  { name: "New Year's Day", startIso: '2026-01-01T00:00:00+08:00', endIso: '2026-01-03T23:59:59+08:00' },
  { name: 'Spring Festival', startIso: '2026-02-15T00:00:00+08:00', endIso: '2026-02-23T23:59:59+08:00' },
  { name: 'Qingming Festival', startIso: '2026-04-04T00:00:00+08:00', endIso: '2026-04-06T23:59:59+08:00' },
  { name: 'Labor Day', startIso: '2026-05-01T00:00:00+08:00', endIso: '2026-05-05T23:59:59+08:00' },
  { name: 'Dragon Boat Festival', startIso: '2026-06-19T00:00:00+08:00', endIso: '2026-06-21T23:59:59+08:00' },
  { name: 'Mid-Autumn Festival', startIso: '2026-09-25T00:00:00+08:00', endIso: '2026-09-27T23:59:59+08:00' },
  { name: 'National Day', startIso: '2026-10-01T00:00:00+08:00', endIso: '2026-10-07T23:59:59+08:00' }
];

const formatDateRange = (startIso: string, endIso: string): string => {
  const dateFormat: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Shanghai'
  };

  const startText = new Date(startIso).toLocaleDateString('en-US', dateFormat);
  const endText = new Date(endIso).toLocaleDateString('en-US', dateFormat);

  return `${startText} - ${endText}`;
};

const formatCountdown = (targetTimestamp: number, currentTimestamp: number): string => {
  const diffMilliseconds = Math.max(targetTimestamp - currentTimestamp, 0);
  const totalSeconds = Math.floor(diffMilliseconds / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

export const HolidayCountdown = () => {
  const [currentTimestamp, setCurrentTimestamp] = useState(() => Date.now());

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCurrentTimestamp(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  const upcomingHoliday = useMemo(() => {
    return CHINA_2026_HOLIDAYS.find((item) => {
      return new Date(item.startIso).getTime() > currentTimestamp;
    });
  }, [currentTimestamp]);

  const countdownText = useMemo(() => {
    if (!upcomingHoliday) {
      return 'All 2026 holidays have started.';
    }

    return formatCountdown(new Date(upcomingHoliday.startIso).getTime(), currentTimestamp);
  }, [currentTimestamp, upcomingHoliday]);

  return (
    <aside className="holiday-countdown" aria-label="China 2026 holiday countdown">
      <p className="holiday-countdown-label">China 2026 Holiday Countdown</p>
      {upcomingHoliday ? <p className="holiday-countdown-next">Next: {upcomingHoliday.name}</p> : null}
      <p className="holiday-countdown-timer">{countdownText}</p>
      <ul className="holiday-countdown-list">
        {CHINA_2026_HOLIDAYS.map((item) => (
          <li key={item.name}>
            <span>{item.name}</span>
            <span>{formatDateRange(item.startIso, item.endIso)}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};
