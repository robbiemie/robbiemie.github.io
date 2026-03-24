import { useEffect, useMemo, useState } from 'react';

export type HealthGender = 'male' | 'female' | 'other';
export type HealthRangeKey = 'underweight' | 'normal' | 'overweight' | 'obese';
export type HealthDimension = 'day' | 'week' | 'month' | 'year';
export type HealthChartType = 'line' | 'area' | 'bar';
export type HealthMetric = 'bmi' | 'weight' | 'bodyFat';

export type HealthRecord = {
  id: string;
  date: string;
  weightKg: number;
  heightCm: number;
  gender: HealthGender;
  bmi: number;
  bodyFat: number;
  waistCm: number;
  targetWeightKg: number;
  note: string;
};

export type HealthTrendPoint = {
  label: string;
  value: number;
  count: number;
};

type HealthDraft = {
  date: string;
  weightKg: string;
  heightCm: string;
  gender: HealthGender;
  bodyFat: string;
  waistCm: string;
  targetWeightKg: string;
  note: string;
};

const HEALTH_STORAGE_KEY = 'tools.health.records.v2';
const HEALTH_DRAFT_STORAGE_KEY = 'tools.health.draft.v1';
const LEGACY_HEALTH_STORAGE_KEYS = ['tools.health.records.v1'];

export const calculateBmi = (weightKg: number, heightCm: number): number => {
  if (weightKg <= 0 || heightCm <= 0) {
    return 0;
  }
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
};

export const getBmiRangeKey = (bmi: number): HealthRangeKey => {
  if (bmi < 18.5) {
    return 'underweight';
  }
  if (bmi < 24) {
    return 'normal';
  }
  if (bmi < 28) {
    return 'overweight';
  }
  return 'obese';
};

const getHealthPeriodLabel = (isoDate: string, dimension: HealthDimension): string => {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  if (dimension === 'day') {
    return `${month}/${day}`;
  }

  if (dimension === 'month') {
    return `${year}-${month}`;
  }

  if (dimension === 'year') {
    return `${year}`;
  }

  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const dayOffset = Math.floor((date.getTime() - firstDayOfYear.getTime()) / 86400000);
  const week = Math.ceil((dayOffset + firstDayOfYear.getDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
};

const getMetricValue = (record: HealthRecord, metric: HealthMetric): number => {
  if (metric === 'weight') {
    return record.weightKg;
  }
  if (metric === 'bodyFat') {
    return record.bodyFat;
  }
  return record.bmi;
};

export const buildHealthTrend = (records: HealthRecord[], dimension: HealthDimension, metric: HealthMetric): HealthTrendPoint[] => {
  const grouped = new Map<string, { total: number; count: number }>();

  records.forEach((record) => {
    const label = getHealthPeriodLabel(record.date, dimension);
    const current = grouped.get(label) ?? { total: 0, count: 0 };
    current.total += getMetricValue(record, metric);
    current.count += 1;
    grouped.set(label, current);
  });

  return [...grouped.entries()]
    .map(([label, meta]) => ({
      label,
      value: Number((meta.total / meta.count).toFixed(1)),
      count: meta.count
    }))
    .sort((left, right) => left.label.localeCompare(right.label))
    .slice(-12);
};

const getDefaultDraft = (): HealthDraft => ({
  date: new Date().toISOString().slice(0, 10),
  weightKg: '78',
  heightCm: '178',
  gender: 'male',
  bodyFat: '18',
  waistCm: '78',
  targetWeightKg: '75',
  note: ''
});

export const useHealthTracker = () => {
  const [draft, setDraft] = useState<HealthDraft>(() => getDefaultDraft());
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [dimension, setDimension] = useState<HealthDimension>('week');
  const [chartType, setChartType] = useState<HealthChartType>('area');
  const [metric, setMetric] = useState<HealthMetric>('bmi');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const raw = window.localStorage.getItem(HEALTH_STORAGE_KEY);
    const legacyRaw = LEGACY_HEALTH_STORAGE_KEYS
      .map((storageKey) => window.localStorage.getItem(storageKey))
      .find((value) => Boolean(value));

    const recordSource = raw ?? legacyRaw;
    if (recordSource) {
      try {
        const parsed = JSON.parse(recordSource) as HealthRecord[];
        if (Array.isArray(parsed)) {
          setRecords(parsed);
        }
      } catch {
        // Ignore broken cache and keep defaults.
      }
    }

    const draftRaw = window.localStorage.getItem(HEALTH_DRAFT_STORAGE_KEY);
    if (!draftRaw) {
      return;
    }

    try {
      const parsedDraft = JSON.parse(draftRaw) as Partial<HealthDraft>;
      setDraft((previous) => ({
        ...previous,
        ...parsedDraft
      }));
    } catch {
      // Ignore broken draft cache and keep defaults.
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !isHydrated) {
      return;
    }
    window.localStorage.setItem(HEALTH_STORAGE_KEY, JSON.stringify(records));
  }, [isHydrated, records]);

  useEffect(() => {
    if (typeof window === 'undefined' || !isHydrated) {
      return;
    }
    window.localStorage.setItem(HEALTH_DRAFT_STORAGE_KEY, JSON.stringify(draft));
  }, [draft, isHydrated]);

  const currentBmi = useMemo(
    () => calculateBmi(Number(draft.weightKg), Number(draft.heightCm)),
    [draft.heightCm, draft.weightKg]
  );

  const currentRangeKey = useMemo(
    () => getBmiRangeKey(currentBmi || 0),
    [currentBmi]
  );

  const healthyWeightRange = useMemo(() => {
    const heightCm = Number(draft.heightCm);
    if (heightCm <= 0) {
      return { min: 0, max: 0 };
    }
    const heightM = heightCm / 100;
    return {
      min: Number((18.5 * heightM * heightM).toFixed(1)),
      max: Number((23.9 * heightM * heightM).toFixed(1))
    };
  }, [draft.heightCm]);

  const weightDelta = useMemo(() => {
    const target = Number(draft.targetWeightKg);
    const current = Number(draft.weightKg);
    if (target <= 0 || current <= 0) {
      return 0;
    }
    return Number((current - target).toFixed(1));
  }, [draft.targetWeightKg, draft.weightKg]);

  const latestRecord = records[records.length - 1] ?? null;
  const trendPoints = useMemo(
    () => buildHealthTrend(records, dimension, metric),
    [records, dimension, metric]
  );

  const saveRecord = () => {
    const weightKg = Number(draft.weightKg);
    const heightCm = Number(draft.heightCm);
    const bodyFat = Number(draft.bodyFat);
    const waistCm = Number(draft.waistCm);
    const targetWeightKg = Number(draft.targetWeightKg);
    const bmi = calculateBmi(weightKg, heightCm);

    if (!draft.date || bmi <= 0) {
      return false;
    }

    const nextRecord: HealthRecord = {
      id: `${draft.date}-${Date.now()}`,
      date: draft.date,
      weightKg,
      heightCm,
      gender: draft.gender,
      bmi,
      bodyFat: bodyFat > 0 ? bodyFat : 0,
      waistCm: waistCm > 0 ? waistCm : 0,
      targetWeightKg: targetWeightKg > 0 ? targetWeightKg : 0,
      note: draft.note.trim()
    };

    setRecords((previous) =>
      [...previous, nextRecord].sort((left, right) => left.date.localeCompare(right.date))
    );
    return true;
  };

  const removeRecord = (recordId: string) => {
    setRecords((previous) => previous.filter((record) => record.id !== recordId));
  };

  const clearRecords = () => {
    setRecords([]);
  };

  return {
    draft,
    setDraft,
    records,
    dimension,
    setDimension,
    chartType,
    setChartType,
    metric,
    setMetric,
    currentBmi,
    currentRangeKey,
    healthyWeightRange,
    weightDelta,
    latestRecord,
    trendPoints,
    saveRecord,
    removeRecord,
    clearRecords
  };
};
