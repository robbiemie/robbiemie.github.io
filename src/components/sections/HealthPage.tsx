import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useI18n } from '../../i18n/locale-context';
import {
  type HealthChartType,
  type HealthDimension,
  type HealthMetric,
  getBmiRangeKey,
  useHealthTracker
} from '../../hooks/useHealthTracker';

const getRouteHref = (segment: '' | 'tools'): string => {
  const basePath = import.meta.env.BASE_URL ?? '/';
  const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
  return segment ? `${normalizedBase}${segment}` : normalizedBase;
};

type HealthPageProps = {
  standalone?: boolean;
};

export const HealthPage = ({ standalone = false }: HealthPageProps) => {
  const { message } = useI18n();
  const homeHref = getRouteHref('');
  const toolsHref = getRouteHref('tools');
  const {
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
  } = useHealthTracker();

  const renderChart = () => {
    const sharedAxisProps = {
      dataKey: 'label' as const,
      tickLine: false,
      axisLine: false,
      tick: { fill: '#47708b', fontSize: 12, fontWeight: 700 }
    };

    const sharedYAxisProps = {
      tickLine: false,
      axisLine: false,
      tick: { fill: '#47708b', fontSize: 12, fontWeight: 700 },
      domain: ['dataMin - 1', 'dataMax + 1'] as [string, string]
    };

    const sharedTooltip = (
      <Tooltip
        cursor={{ stroke: 'rgba(77, 161, 222, 0.28)', strokeWidth: 2 }}
        contentStyle={{
          borderRadius: 14,
          border: '1px solid rgba(59, 134, 189, 0.18)',
          boxShadow: '0 12px 28px rgba(53, 120, 163, 0.16)',
          background: 'rgba(255,255,255,0.96)'
        }}
        formatter={(value, _name, item) => [
          `${message.health.metricValueLabels[metric]} ${typeof value === 'number' ? value : Number(value ?? 0)}`,
          `${message.health.dimensions[dimension]} · ${item.payload.count}`
        ]}
      />
    );

    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trendPoints} margin={{ top: 18, right: 12, bottom: 12, left: 0 }}>
            <defs>
              <linearGradient id="healthLineGradientStandalone" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ff9b5b" />
                <stop offset="100%" stopColor="#48c8ff" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(75, 143, 189, 0.14)" vertical={false} />
            <XAxis {...sharedAxisProps} />
            <YAxis {...sharedYAxisProps} />
            {sharedTooltip}
            <Line type="monotone" dataKey="value" stroke="url(#healthLineGradientStandalone)" strokeWidth={4} dot={{ r: 5, fill: '#fff', stroke: '#ff9b5b', strokeWidth: 3 }} activeDot={{ r: 7 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={trendPoints} margin={{ top: 18, right: 12, bottom: 12, left: 0 }}>
            <defs>
              <linearGradient id="healthBarGradientStandalone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffb469" />
                <stop offset="100%" stopColor="#58bfff" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(75, 143, 189, 0.14)" vertical={false} />
            <XAxis {...sharedAxisProps} />
            <YAxis {...sharedYAxisProps} />
            {sharedTooltip}
            <Bar dataKey="value" fill="url(#healthBarGradientStandalone)" radius={[10, 10, 4, 4]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={trendPoints} margin={{ top: 18, right: 12, bottom: 12, left: 0 }}>
          <defs>
            <linearGradient id="healthAreaGradientStandalone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#57b7ff" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#57b7ff" stopOpacity="0.06" />
            </linearGradient>
            <linearGradient id="healthAreaStrokeGradientStandalone" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ff9b5b" />
              <stop offset="100%" stopColor="#48c8ff" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(75, 143, 189, 0.14)" vertical={false} />
          <XAxis {...sharedAxisProps} />
          <YAxis {...sharedYAxisProps} />
          {sharedTooltip}
          <Area type="monotone" dataKey="value" stroke="url(#healthAreaStrokeGradientStandalone)" strokeWidth={4} fill="url(#healthAreaGradientStandalone)" dot={{ r: 4, fill: '#fff', stroke: '#48c8ff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  return (
    <section className={`tools-section screen-section is-revealed ${standalone ? 'health-page' : ''}`} id="health">
      <header className="section-header section-header-tools">
        <p className="section-kicker">{message.health.kicker}</p>
        <h2 className="section-title">{message.health.title}</h2>
        <p className="tools-description">{message.health.description}</p>
        <div className="tools-header-actions">
          <a className="hero-link hero-link-secondary tools-back-link" href={homeHref}>
            {message.health.backHome}
          </a>
          <a className="hero-link hero-link-secondary tools-back-link" href={toolsHref}>
            {message.health.backTools}
          </a>
        </div>
      </header>

      <article className="tools-card tools-card-single tools-card-health">
        <div className="tools-health-sidebar">
          <h3>{message.health.profileTitle}</h3>
          <p>{message.health.profileDescription}</p>

          <div className="tools-health-form">
            <label className="tools-field">
              <span>{message.health.dateLabel}</span>
              <input type="date" className="tools-input" value={draft.date} onChange={(event) => setDraft((previous) => ({ ...previous, date: event.target.value }))} />
            </label>
            <label className="tools-field">
              <span>{message.health.weightLabel}</span>
              <input type="number" className="tools-input" value={draft.weightKg} onChange={(event) => setDraft((previous) => ({ ...previous, weightKg: event.target.value }))} placeholder="78" />
            </label>
            <label className="tools-field">
              <span>{message.health.heightLabel}</span>
              <input type="number" className="tools-input" value={draft.heightCm} onChange={(event) => setDraft((previous) => ({ ...previous, heightCm: event.target.value }))} placeholder="178" />
            </label>
            <label className="tools-field">
              <span>{message.health.genderLabel}</span>
              <select className="tools-input tools-select" value={draft.gender} onChange={(event) => setDraft((previous) => ({ ...previous, gender: event.target.value as typeof previous.gender }))}>
                <option value="male">{message.health.genderMale}</option>
                <option value="female">{message.health.genderFemale}</option>
                <option value="other">{message.health.genderOther}</option>
              </select>
            </label>
            <label className="tools-field">
              <span>{message.health.bodyFatLabel}</span>
              <input type="number" className="tools-input" value={draft.bodyFat} onChange={(event) => setDraft((previous) => ({ ...previous, bodyFat: event.target.value }))} placeholder="18" />
            </label>
            <label className="tools-field">
              <span>{message.health.waistLabel}</span>
              <input type="number" className="tools-input" value={draft.waistCm} onChange={(event) => setDraft((previous) => ({ ...previous, waistCm: event.target.value }))} placeholder="78" />
            </label>
            <label className="tools-field">
              <span>{message.health.targetWeightLabel}</span>
              <input type="number" className="tools-input" value={draft.targetWeightKg} onChange={(event) => setDraft((previous) => ({ ...previous, targetWeightKg: event.target.value }))} placeholder="62" />
            </label>
            <label className="tools-field">
              <span>{message.health.noteLabel}</span>
              <textarea value={draft.note} onChange={(event) => setDraft((previous) => ({ ...previous, note: event.target.value }))} placeholder={message.health.notePlaceholder} />
            </label>
          </div>

          <div className="tools-health-summary">
            <div className={`tools-health-bmi-card is-${currentRangeKey}`}>
              <span>{message.health.bmiLabel}</span>
              <strong>{currentBmi || '--'}</strong>
              <em>{message.health.ranges[currentRangeKey]}</em>
            </div>
            <div className="tools-health-kpi-grid">
              <div className="tools-health-kpi">
                <span>{message.health.healthyWeightLabel}</span>
                <strong>
                  {healthyWeightRange.min > 0
                    ? `${healthyWeightRange.min} - ${healthyWeightRange.max} kg`
                    : '--'}
                </strong>
              </div>
              <div className="tools-health-kpi">
                <span>{message.health.deltaLabel}</span>
                <strong>{draft.targetWeightKg ? `${weightDelta > 0 ? '+' : ''}${weightDelta} kg` : '--'}</strong>
              </div>
            </div>
            <p className="tools-health-range-copy">{message.health.bmiRangeCopy}</p>
            <ul className="tools-health-range-list">
              <li>{message.health.rangeUnderweight}</li>
              <li>{message.health.rangeNormal}</li>
              <li>{message.health.rangeOverweight}</li>
              <li>{message.health.rangeObese}</li>
            </ul>
          </div>

          <div className="tools-actions tools-actions-three">
            <button type="button" className="world-action-button action-enter" onClick={saveRecord}>
              {message.health.saveAction}
            </button>
            <button type="button" className="world-action-button world-action-button-alt action-rule" onClick={clearRecords}>
              {message.health.clearAction}
            </button>
          </div>
        </div>

        <div className="tools-health-main">
          <div className="tools-health-chart-card">
            <div className="tools-health-chart-header">
              <div>
                <h4>{message.health.trendTitle}</h4>
                <p>{latestRecord ? `${message.health.latestLabel}: ${message.health.metricValueLabels[metric]} ${metric === 'bodyFat' ? latestRecord.bodyFat : metric === 'weight' ? latestRecord.weightKg : latestRecord.bmi}` : message.health.noData}</p>
              </div>
              <div className="tools-health-chart-controls">
                <div className="tools-health-dimension-tabs">
                  {(['day', 'week', 'month', 'year'] as HealthDimension[]).map((item) => (
                    <button key={item} type="button" className={`tools-health-dimension-tab ${dimension === item ? 'is-active' : ''}`} onClick={() => setDimension(item)}>
                      {message.health.dimensions[item]}
                    </button>
                  ))}
                </div>
                <div className="tools-health-dimension-tabs">
                  {(['bmi', 'weight', 'bodyFat'] as HealthMetric[]).map((item) => (
                    <button key={item} type="button" className={`tools-health-dimension-tab ${metric === item ? 'is-active' : ''}`} onClick={() => setMetric(item)}>
                      {message.health.metrics[item]}
                    </button>
                  ))}
                </div>
                <div className="tools-health-dimension-tabs">
                  {(['area', 'line', 'bar'] as HealthChartType[]).map((item) => (
                    <button key={item} type="button" className={`tools-health-dimension-tab ${chartType === item ? 'is-active' : ''}`} onClick={() => setChartType(item)}>
                      {message.health.chartTypes[item]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {trendPoints.length > 0 ? <div className="tools-health-chart-shell">{renderChart()}</div> : <p className="tools-preview-empty">{message.health.noData}</p>}
          </div>

          <div className="tools-health-records-card">
            <div className="tools-health-chart-header">
              <div>
                <h4>{message.health.recordsTitle}</h4>
                <p>{message.health.recordsCount.replace('{count}', String(records.length))}</p>
              </div>
            </div>
            {records.length > 0 ? (
              <div className="tools-health-records-list">
                {records
                  .slice()
                  .reverse()
                  .map((record) => (
                    <article key={record.id} className="tools-health-record-item">
                      <div>
                        <strong>{record.date}</strong>
                        <p>{message.health.genderValue[record.gender]}</p>
                        {record.note ? <p>{record.note}</p> : null}
                      </div>
                      <div>
                        <span>{record.weightKg} kg</span>
                        <span>{record.heightCm} cm</span>
                        <span>{record.bodyFat ? `${record.bodyFat}% BF` : '-- BF'}</span>
                        <span>{record.waistCm ? `${record.waistCm} cm waist` : '-- waist'}</span>
                      </div>
                      <div className={`tools-health-record-bmi is-${getBmiRangeKey(record.bmi)}`}>
                        BMI {record.bmi}
                      </div>
                      <button type="button" className="tools-health-delete" onClick={() => removeRecord(record.id)}>
                        {message.health.deleteAction}
                      </button>
                    </article>
                  ))}
              </div>
            ) : (
              <p className="tools-preview-empty">{message.health.noData}</p>
            )}
          </div>
        </div>
      </article>
    </section>
  );
};
