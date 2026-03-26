import { Suspense, lazy, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
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
import { useAiChat } from '../../hooks/useAiChat';

const MarkdownRendererTool = lazy(() => import('../tools/MarkdownRendererTool'));

const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
]);

type RegexMatchRecord = {
  index: number;
  value: string;
  groups: string[];
};

type HealthGender = 'male' | 'female' | 'other';
type HealthRangeKey = 'underweight' | 'normal' | 'overweight' | 'obese';
type HealthDimension = 'day' | 'week' | 'month' | 'year';

type HealthRecord = {
  id: string;
  date: string;
  weightKg: number;
  heightCm: number;
  gender: HealthGender;
  bmi: number;
};

type HealthTrendPoint = {
  label: string;
  value: number;
  count: number;
};

type HealthChartType = 'line' | 'area' | 'bar';

export type ToolsRouteKey = 'overview' | 'html' | 'json' | 'url' | 'regex' | 'markdown' | 'chat' | 'health';

type ToolsPageProps = {
  activeTool: ToolsRouteKey;
};

const getRouteHref = (segment: '' | 'tools' | 'tools/html' | 'tools/json' | 'tools/url' | 'tools/regex' | 'tools/markdown' | 'tools/chat' | 'tools/health'): string => {
  const basePath = import.meta.env.BASE_URL ?? '/';
  const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
  return segment ? `${normalizedBase}${segment}` : normalizedBase;
};

const formatHtml = (source: string): string => {
  const normalized = source.trim();
  if (!normalized) {
    return '';
  }

  const tokens = normalized
    .replace(/>\s+</g, '><')
    .split(/(<[^>]+>)/g)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);

  const lines: string[] = [];
  let indentLevel = 0;

  for (const token of tokens) {
    const isTag = token.startsWith('<') && token.endsWith('>');
    if (!isTag) {
      lines.push(`${'  '.repeat(indentLevel)}${token}`);
      continue;
    }

    const closingMatch = token.match(/^<\/\s*([a-zA-Z][\w:-]*)\s*>$/);
    const openingMatch = token.match(/^<\s*([a-zA-Z][\w:-]*)[^>]*>$/);
    const selfClosing = /\/>$/.test(token);
    const declaration = /^<!/.test(token) || /^<\?/.test(token);

    if (closingMatch) {
      indentLevel = Math.max(indentLevel - 1, 0);
      lines.push(`${'  '.repeat(indentLevel)}${token}`);
      continue;
    }

    lines.push(`${'  '.repeat(indentLevel)}${token}`);
    if (declaration || selfClosing || !openingMatch) {
      continue;
    }

    const tagName = openingMatch[1].toLowerCase();
    if (!VOID_TAGS.has(tagName)) {
      indentLevel += 1;
    }
  }

  return lines.join('\n');
};

const validateHtml = (source: string): { ok: boolean; message: string } => {
  const normalized = source.trim();
  if (!normalized) {
    return { ok: false, message: 'Input is empty.' };
  }

  const stack: string[] = [];
  const tags = normalized.match(/<\/?[a-zA-Z][\w:-]*\b[^>]*>/g) ?? [];

  for (const tag of tags) {
    const closing = /^<\//.test(tag);
    const selfClosing = /\/>$/.test(tag);
    const nameMatch = tag.match(/^<\/?\s*([a-zA-Z][\w:-]*)/);
    if (!nameMatch) {
      continue;
    }

    const tagName = nameMatch[1].toLowerCase();
    if (VOID_TAGS.has(tagName) || selfClosing) {
      continue;
    }

    if (!closing) {
      stack.push(tagName);
      continue;
    }

    const last = stack.pop();
    if (last !== tagName) {
      return { ok: false, message: `Expected </${last ?? 'none'}> but found </${tagName}>.` };
    }
  }

  if (stack.length > 0) {
    return { ok: false, message: `Missing closing tag for <${stack[stack.length - 1]}>.` };
  }

  return { ok: true, message: '' };
};

const toSnakeCase = (value: string): string => {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
};

const convertJsonKeysToSnakeCase = (input: unknown): unknown => {
  if (Array.isArray(input)) {
    return input.map((item) => convertJsonKeysToSnakeCase(item));
  }

  if (input !== null && typeof input === 'object') {
    const sourceRecord = input as Record<string, unknown>;
    const resultRecord: Record<string, unknown> = {};
    Object.entries(sourceRecord).forEach(([key, value]) => {
      resultRecord[toSnakeCase(key)] = convertJsonKeysToSnakeCase(value);
    });
    return resultRecord;
  }

  return input;
};

const HEALTH_STORAGE_KEY = 'tools.health.records.v1';

const calculateBmi = (weightKg: number, heightCm: number): number => {
  if (weightKg <= 0 || heightCm <= 0) {
    return 0;
  }
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
};

const getBmiRangeKey = (bmi: number): HealthRangeKey => {
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

const buildHealthTrend = (records: HealthRecord[], dimension: HealthDimension): HealthTrendPoint[] => {
  const grouped = new Map<string, { total: number; count: number }>();

  records.forEach((record) => {
    const label = getHealthPeriodLabel(record.date, dimension);
    const current = grouped.get(label) ?? { total: 0, count: 0 };
    current.total += record.bmi;
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

export const ToolsPage = ({ activeTool }: ToolsPageProps) => {
  const { message } = useI18n();
  const homeHref = useMemo(() => getRouteHref(''), []);
  const overviewHref = useMemo(() => getRouteHref('tools'), []);
  const htmlHref = useMemo(() => getRouteHref('tools/html'), []);
  const jsonHref = useMemo(() => getRouteHref('tools/json'), []);
  const urlHref = useMemo(() => getRouteHref('tools/url'), []);
  const regexHref = useMemo(() => getRouteHref('tools/regex'), []);
  const markdownHref = useMemo(() => getRouteHref('tools/markdown'), []);
  const chatHref = useMemo(() => getRouteHref('tools/chat'), []);
  const healthHref = useMemo(() => getRouteHref('tools/health'), []);

  const [htmlSource, setHtmlSource] = useState('');
  const [htmlOutput, setHtmlOutput] = useState('');
  const [htmlPreviewDoc, setHtmlPreviewDoc] = useState('');
  const [htmlValidationMessage, setHtmlValidationMessage] = useState('');
  const [htmlValidationPassed, setHtmlValidationPassed] = useState<boolean | null>(null);

  const [jsonSource, setJsonSource] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonValidationMessage, setJsonValidationMessage] = useState('');
  const [jsonValidationPassed, setJsonValidationPassed] = useState<boolean | null>(null);

  const [urlSource, setUrlSource] = useState('');
  const [urlOutput, setUrlOutput] = useState('');
  const [regexPattern, setRegexPattern] = useState('');
  const [regexFlags, setRegexFlags] = useState('g');
  const [regexSource, setRegexSource] = useState('');
  const [regexMatches, setRegexMatches] = useState<RegexMatchRecord[]>([]);
  const [regexError, setRegexError] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [showChatSettings, setShowChatSettings] = useState(false);
  const chatScrollRef = useRef<HTMLElement | null>(null);
  const [healthDate, setHealthDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [healthWeight, setHealthWeight] = useState('78');
  const [healthHeight, setHealthHeight] = useState('178');
  const [healthGender, setHealthGender] = useState<HealthGender>('male');
  const [healthDimension, setHealthDimension] = useState<HealthDimension>('week');
  const [healthChartType, setHealthChartType] = useState<HealthChartType>('area');
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);

  const {
    settings: chatSettings,
    messages: chatMessages,
    isSending: isChatSending,
    canUseRemote: canUseRemoteChat,
    updateSettings: updateChatSettings,
    clearMessages: clearChatMessages,
    sendMessage: sendChatMessage
  } = useAiChat({
    initialAssistantMessage: message.tools.chatGreeting
  });

  const currentHealthBmi = calculateBmi(Number(healthWeight), Number(healthHeight));
  const currentHealthRangeKey = getBmiRangeKey(currentHealthBmi || 0);
  const healthTrendPoints = buildHealthTrend(healthRecords, healthDimension);
  const latestHealthRecord = healthRecords[healthRecords.length - 1] ?? null;

  const onFormatHtml = () => {
    setHtmlOutput(formatHtml(htmlSource));
  };

  const onValidateHtml = () => {
    const result = validateHtml(htmlSource);
    setHtmlValidationPassed(result.ok);
    setHtmlValidationMessage(result.ok ? message.tools.validatePass : `${message.tools.validateFailPrefix} ${result.message}`);
  };

  const onClearHtml = () => {
    setHtmlSource('');
    setHtmlOutput('');
    setHtmlPreviewDoc('');
    setHtmlValidationMessage('');
    setHtmlValidationPassed(null);
  };

  const onPreviewHtml = () => {
    const previewSource = htmlOutput.trim() || htmlSource.trim();
    setHtmlPreviewDoc(previewSource);
  };

  const onCopyHtml = async () => {
    if (!htmlOutput) {
      return;
    }
    await navigator.clipboard.writeText(htmlOutput);
  };

  const onFormatJson = () => {
    const normalized = jsonSource.trim();
    if (!normalized) {
      setJsonOutput('');
      setJsonValidationMessage('');
      setJsonValidationPassed(null);
      return;
    }
    try {
      const parsed = JSON.parse(normalized);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      setJsonValidationPassed(true);
      setJsonValidationMessage(message.tools.jsonValidatePass);
    } catch (error) {
      setJsonValidationPassed(false);
      setJsonValidationMessage(`${message.tools.jsonValidateFailPrefix} ${(error as Error).message}`);
    }
  };

  const onValidateJson = () => {
    const normalized = jsonSource.trim();
    if (!normalized) {
      setJsonValidationPassed(false);
      setJsonValidationMessage(`${message.tools.jsonValidateFailPrefix} Input is empty.`);
      return;
    }

    try {
      JSON.parse(normalized);
      setJsonValidationPassed(true);
      setJsonValidationMessage(message.tools.jsonValidatePass);
    } catch (error) {
      setJsonValidationPassed(false);
      setJsonValidationMessage(`${message.tools.jsonValidateFailPrefix} ${(error as Error).message}`);
    }
  };

  const onSnakeCaseJson = () => {
    const normalized = jsonSource.trim();
    if (!normalized) {
      setJsonValidationPassed(false);
      setJsonValidationMessage(`${message.tools.jsonValidateFailPrefix} Input is empty.`);
      return;
    }

    try {
      const parsed = JSON.parse(normalized);
      const converted = convertJsonKeysToSnakeCase(parsed);
      setJsonOutput(JSON.stringify(converted, null, 2));
      setJsonValidationPassed(true);
      setJsonValidationMessage(message.tools.jsonSnakeCaseDone);
    } catch (error) {
      setJsonValidationPassed(false);
      setJsonValidationMessage(`${message.tools.jsonValidateFailPrefix} ${(error as Error).message}`);
    }
  };

  const onClearJson = () => {
    setJsonSource('');
    setJsonOutput('');
    setJsonValidationMessage('');
    setJsonValidationPassed(null);
  };

  const onCopyJson = async () => {
    if (!jsonOutput) {
      return;
    }
    await navigator.clipboard.writeText(jsonOutput);
  };

  const onEncodeUrl = () => {
    setUrlOutput(encodeURIComponent(urlSource));
  };

  const onDecodeUrl = () => {
    try {
      setUrlOutput(decodeURIComponent(urlSource));
    } catch (error) {
      setUrlOutput(`${message.tools.validateFailPrefix} ${(error as Error).message}`);
    }
  };

  const onClearUrl = () => {
    setUrlSource('');
    setUrlOutput('');
  };

  const onCopyUrl = async () => {
    if (!urlOutput) {
      return;
    }
    await navigator.clipboard.writeText(urlOutput);
  };

  const onRunRegex = () => {
    setRegexError('');
    setRegexMatches([]);

    const normalizedPattern = regexPattern.trim();
    if (!normalizedPattern || !regexSource) {
      return;
    }

    try {
      const regex = new RegExp(normalizedPattern, regexFlags.trim());
      const matches: RegexMatchRecord[] = [];
      if (regex.global) {
        let guard = 0;
        let currentMatch = regex.exec(regexSource);
        while (currentMatch && guard < 3000) {
          matches.push({
            index: currentMatch.index,
            value: currentMatch[0],
            groups: currentMatch.slice(1).filter((group) => typeof group === 'string')
          });
          if (currentMatch[0] === '') {
            regex.lastIndex += 1;
          }
          currentMatch = regex.exec(regexSource);
          guard += 1;
        }
      } else {
        const single = regex.exec(regexSource);
        if (single) {
          matches.push({
            index: single.index,
            value: single[0],
            groups: single.slice(1).filter((group) => typeof group === 'string')
          });
        }
      }
      setRegexMatches(matches);
    } catch (error) {
      setRegexError(`${message.tools.regexInvalidPrefix} ${(error as Error).message}`);
    }
  };

  const onClearRegex = () => {
    setRegexPattern('');
    setRegexFlags('g');
    setRegexSource('');
    setRegexMatches([]);
    setRegexError('');
  };

  const onSubmitChat = async () => {
    const content = chatInput.trim();
    if (!content || isChatSending) {
      return;
    }
    setChatInput('');
    await sendChatMessage(content);
  };

  useEffect(() => {
    if (!chatScrollRef.current) {
      return;
    }
    chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [chatMessages, isChatSending]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const raw = window.localStorage.getItem(HEALTH_STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as HealthRecord[];
      if (Array.isArray(parsed)) {
        setHealthRecords(parsed);
      }
    } catch {
      // Ignore invalid local cache and keep empty list.
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(HEALTH_STORAGE_KEY, JSON.stringify(healthRecords));
  }, [healthRecords]);

  const renderRegexPreview = (): ReactNode => {
    if (!regexSource) {
      return <p className="tools-preview-empty">{message.tools.regexNoMatch}</p>;
    }

    if (regexMatches.length === 0) {
      return <p className="tools-preview-empty">{message.tools.regexNoMatch}</p>;
    }

    const segments: ReactNode[] = [];
    let cursor = 0;
    regexMatches.forEach((match, index) => {
      const matchEnd = match.index + match.value.length;
      if (match.index > cursor) {
        segments.push(
          <span key={`text-${cursor}`}>{regexSource.slice(cursor, match.index)}</span>
        );
      }
      segments.push(
        <mark className="tools-regex-mark" key={`mark-${index}`}>
          {regexSource.slice(match.index, matchEnd)}
        </mark>
      );
      cursor = matchEnd;
    });
    if (cursor < regexSource.length) {
      segments.push(<span key={`tail-${cursor}`}>{regexSource.slice(cursor)}</span>);
    }
    return <p className="tools-regex-highlight">{segments}</p>;
  };

  const renderOverview = () => {
    return (
      <div className="tools-overview-grid">
        <a className="tools-nav-card" href={htmlHref}>
          <h3>{message.tools.formatterTitle}</h3>
          <p>{message.tools.formatterDescription}</p>
        </a>
        <a className="tools-nav-card" href={jsonHref}>
          <h3>{message.tools.jsonTitle}</h3>
          <p>{message.tools.jsonDescription}</p>
        </a>
        <a className="tools-nav-card" href={urlHref}>
          <h3>{message.tools.urlTitle}</h3>
          <p>{message.tools.urlDescription}</p>
        </a>
        <a className="tools-nav-card" href={regexHref}>
          <h3>{message.tools.regexTitle}</h3>
          <p>{message.tools.regexDescription}</p>
        </a>
        <a className="tools-nav-card" href={markdownHref}>
          <h3>{message.tools.markdownTitle}</h3>
          <p>{message.tools.markdownDescription}</p>
        </a>
        <a className="tools-nav-card" href={chatHref}>
          <h3>{message.tools.chatTitle}</h3>
          <p>{message.tools.chatDescription}</p>
        </a>
        <a className="tools-nav-card" href={healthHref}>
          <h3>{message.tools.healthTitle}</h3>
          <p>{message.tools.healthDescription}</p>
        </a>
      </div>
    );
  };

  const renderHtmlTool = () => {
    return (
      <article className="tools-card tools-card-single tools-card-html">
        <div className="tools-card-main">
          <h3>{message.tools.formatterTitle}</h3>
          <p>{message.tools.formatterDescription}</p>
          <label className="tools-field">
            <span>{message.tools.sourceLabel}</span>
            <textarea value={htmlSource} onChange={(event) => setHtmlSource(event.target.value)} placeholder={message.tools.sourcePlaceholder} />
          </label>
          <div className="tools-actions tools-actions-four">
            <button type="button" className="world-action-button action-enter" onClick={onFormatHtml}>
              {message.tools.formatAction}
            </button>
            <button type="button" className="world-action-button action-spin" onClick={onValidateHtml}>
              {message.tools.validateAction}
            </button>
            <button type="button" className="world-action-button action-history" onClick={onPreviewHtml}>
              {message.tools.previewAction}
            </button>
            <button type="button" className="world-action-button world-action-button-alt action-rule" onClick={onClearHtml}>
              {message.tools.clearAction}
            </button>
          </div>
          {htmlValidationMessage ? <p className={`tools-validation ${htmlValidationPassed ? 'is-pass' : 'is-fail'}`}>{htmlValidationMessage}</p> : null}
          <label className="tools-field">
            <span>{message.tools.outputLabel}</span>
            <textarea value={htmlOutput} readOnly />
          </label>
          <button type="button" className="world-action-button world-action-button-alt action-history tools-copy" onClick={onCopyHtml}>
            {message.tools.copyAction}
          </button>
        </div>
        <section className="tools-preview tools-card-side">
          <h4>{message.tools.previewTitle}</h4>
          {htmlPreviewDoc ? (
            <iframe className="tools-preview-frame" srcDoc={htmlPreviewDoc} title={message.tools.previewTitle} sandbox="allow-scripts allow-forms" />
          ) : (
            <p className="tools-preview-empty">{message.tools.previewEmpty}</p>
          )}
        </section>
      </article>
    );
  };

  const renderJsonTool = () => {
    return (
      <article className="tools-card tools-card-single">
        <h3>{message.tools.jsonTitle}</h3>
        <p>{message.tools.jsonDescription}</p>
        <label className="tools-field">
          <span>{message.tools.sourceLabel}</span>
          <textarea value={jsonSource} onChange={(event) => setJsonSource(event.target.value)} placeholder={message.tools.jsonPlaceholder} />
        </label>
        <div className="tools-actions tools-actions-four">
          <button type="button" className="world-action-button action-enter" onClick={onFormatJson}>
            {message.tools.jsonFormatAction}
          </button>
          <button type="button" className="world-action-button action-spin" onClick={onValidateJson}>
            {message.tools.jsonValidateAction}
          </button>
          <button type="button" className="world-action-button action-history" onClick={onSnakeCaseJson}>
            {message.tools.jsonSnakeCaseAction}
          </button>
          <button type="button" className="world-action-button world-action-button-alt action-rule" onClick={onClearJson}>
            {message.tools.clearAction}
          </button>
        </div>
        {jsonValidationMessage ? <p className={`tools-validation ${jsonValidationPassed ? 'is-pass' : 'is-fail'}`}>{jsonValidationMessage}</p> : null}
        <label className="tools-field">
          <span>{message.tools.outputLabel}</span>
          <textarea value={jsonOutput} readOnly />
        </label>
        <button type="button" className="world-action-button world-action-button-alt action-history tools-copy" onClick={onCopyJson}>
          {message.tools.copyAction}
        </button>
      </article>
    );
  };

  const renderUrlTool = () => {
    return (
      <article className="tools-card tools-card-single">
        <h3>{message.tools.urlTitle}</h3>
        <p>{message.tools.urlDescription}</p>
        <label className="tools-field">
          <span>{message.tools.sourceLabel}</span>
          <textarea value={urlSource} onChange={(event) => setUrlSource(event.target.value)} placeholder={message.tools.urlPlaceholder} />
        </label>
        <div className="tools-actions tools-actions-three">
          <button type="button" className="world-action-button action-enter" onClick={onEncodeUrl}>
            {message.tools.urlEncodeAction}
          </button>
          <button type="button" className="world-action-button action-spin" onClick={onDecodeUrl}>
            {message.tools.urlDecodeAction}
          </button>
          <button type="button" className="world-action-button world-action-button-alt action-rule" onClick={onClearUrl}>
            {message.tools.clearAction}
          </button>
        </div>
        <label className="tools-field">
          <span>{message.tools.outputLabel}</span>
          <textarea value={urlOutput} readOnly />
        </label>
        <button type="button" className="world-action-button world-action-button-alt action-history tools-copy" onClick={onCopyUrl}>
          {message.tools.copyAction}
        </button>
      </article>
    );
  };

  const renderRegexTool = () => {
    return (
      <article className="tools-card tools-card-single">
        <h3>{message.tools.regexTitle}</h3>
        <p>{message.tools.regexDescription}</p>
        <div className="tools-inline-fields">
          <label className="tools-field">
            <span>{message.tools.regexPatternLabel}</span>
            <input
              type="text"
              className="tools-input"
              value={regexPattern}
              onChange={(event) => setRegexPattern(event.target.value)}
              placeholder={message.tools.regexPatternPlaceholder}
            />
          </label>
          <label className="tools-field">
            <span>{message.tools.regexFlagsLabel}</span>
            <input type="text" className="tools-input" value={regexFlags} onChange={(event) => setRegexFlags(event.target.value)} placeholder="gim" />
          </label>
        </div>
        <label className="tools-field">
          <span>{message.tools.sourceLabel}</span>
          <textarea value={regexSource} onChange={(event) => setRegexSource(event.target.value)} placeholder={message.tools.regexTextPlaceholder} />
        </label>
        <div className="tools-actions tools-actions-three">
          <button type="button" className="world-action-button action-enter" onClick={onRunRegex}>
            {message.tools.regexRunAction}
          </button>
          <button type="button" className="world-action-button world-action-button-alt action-rule" onClick={onClearRegex}>
            {message.tools.clearAction}
          </button>
        </div>
        {regexError ? <p className="tools-validation is-fail">{regexError}</p> : null}
        <section className="tools-preview">
          <h4>{message.tools.regexResultTitle}</h4>
          {renderRegexPreview()}
          <p className="tools-regex-count">
            {message.tools.regexMatchCount}: {regexMatches.length}
          </p>
          {regexMatches.length > 0 ? (
            <ul className="tools-regex-list">
              {regexMatches.map((match, index) => (
                <li key={`regex-match-${index}`}>
                  <span>
                    {message.tools.regexMatchItem} {index + 1}: [{match.index}] "{match.value}"
                  </span>
                  {match.groups.length > 0 ? (
                    <span>
                      {message.tools.regexGroupsLabel}: {match.groups.join(' | ')}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </article>
    );
  };

  const renderChatTool = () => {
    return (
      <article className="tools-card tools-card-single tools-card-chat">
        <div className="tools-chat-top">
          <div className="tools-chat-header">
            <h3>{message.tools.chatTitle}</h3>
            <p>{message.tools.chatDescription}</p>
            <div className="tools-actions tools-actions-three">
              <button type="button" className="world-action-button action-enter" onClick={() => setShowChatSettings((prev) => !prev)}>
                {showChatSettings ? message.tools.chatHideSettingsAction : message.tools.chatShowSettingsAction}
              </button>
              <button type="button" className="world-action-button world-action-button-alt action-rule" onClick={() => clearChatMessages(message.tools.chatGreeting)}>
                {message.tools.chatResetAction}
              </button>
            </div>
            <p className={`tools-validation ${canUseRemoteChat ? 'is-pass' : 'is-fail'}`}>
              {canUseRemoteChat ? message.tools.chatRemoteOn : message.tools.chatRemoteOff}
            </p>
          </div>

          {showChatSettings ? (
            <section className="tools-chat-settings">
              <label className="tools-field">
                <span>{message.tools.chatEndpointLabel}</span>
                <input
                  type="text"
                  className="tools-input"
                  value={chatSettings.endpoint}
                  onChange={(event) => updateChatSettings({ endpoint: event.target.value })}
                  placeholder={message.tools.chatEndpointPlaceholder}
                />
              </label>
              <label className="tools-field">
                <span>{message.tools.chatModelLabel}</span>
                <input
                  type="text"
                  className="tools-input"
                  value={chatSettings.model}
                  onChange={(event) => updateChatSettings({ model: event.target.value })}
                  placeholder={message.tools.chatModelPlaceholder}
                />
              </label>
              <label className="tools-field">
                <span>{message.tools.chatApiKeyLabel}</span>
                <input
                  type="password"
                  className="tools-input"
                  value={chatSettings.apiKey}
                  onChange={(event) => updateChatSettings({ apiKey: event.target.value })}
                  placeholder={message.tools.chatApiKeyPlaceholder}
                />
              </label>
              <label className="tools-field">
                <span>{message.tools.chatSystemPromptLabel}</span>
                <textarea
                  value={chatSettings.systemPrompt}
                  onChange={(event) => updateChatSettings({ systemPrompt: event.target.value })}
                  placeholder={message.tools.chatSystemPromptPlaceholder}
                />
              </label>
            </section>
          ) : null}
        </div>

        <section className="tools-chat-window" ref={chatScrollRef}>
          {chatMessages.map((item) => (
            <article key={item.id} className={`tools-chat-bubble ${item.role === 'user' ? 'is-user' : 'is-assistant'}`}>
              <p className="tools-chat-role">{item.role === 'user' ? message.tools.chatUserLabel : message.tools.chatAssistantLabel}</p>
              <p>{item.content}</p>
            </article>
          ))}
          {isChatSending ? <p className="tools-chat-sending">{message.tools.chatSending}</p> : null}
        </section>

        <div className="tools-chat-composer">
          <label className="tools-field tools-chat-input-field">
            <span>{message.tools.chatInputLabel}</span>
            <textarea
              className="tools-chat-input"
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder={message.tools.chatInputPlaceholder}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                  event.preventDefault();
                  void onSubmitChat();
                }
              }}
            />
          </label>
          <div className="tools-actions tools-actions-three">
            <button type="button" className="world-action-button action-enter" onClick={() => void onSubmitChat()} disabled={isChatSending}>
              {message.tools.chatSendAction}
            </button>
          </div>
        </div>
      </article>
    );
  };

  const renderMarkdownTool = () => {
    return (
      <Suspense
        fallback={
          <article className="tools-card tools-card-single">
            <h3>{message.tools.markdownTitle}</h3>
            <p>{message.tools.markdownDescription}</p>
          </article>
        }
      >
        <MarkdownRendererTool
          title={message.tools.markdownTitle}
          description={message.tools.markdownDescription}
          sourceLabel={message.tools.sourceLabel}
          previewLabel={message.tools.previewTitle}
          placeholder={message.tools.markdownPlaceholder}
          emptyText={message.tools.markdownEmpty}
          copyAction={message.tools.copyAction}
          clearAction={message.tools.clearAction}
          exampleAction={message.tools.markdownExampleAction}
          copyMarkdownAction={message.tools.markdownCopySourceAction}
          copyRenderedAction={message.tools.markdownCopyRenderedAction}
          copyCodeAction={message.tools.markdownCopyCodeAction}
          copySuccessText={message.tools.markdownCopySuccess}
          copyFailedText={message.tools.markdownCopyFailed}
        />
      </Suspense>
    );
  };

  const renderHealthTool = () => {
    const onSaveHealthRecord = () => {
      const weightKg = Number(healthWeight);
      const heightCm = Number(healthHeight);
      const bmi = calculateBmi(weightKg, heightCm);
      if (!healthDate || bmi <= 0) {
        return;
      }

      const nextRecord: HealthRecord = {
        id: `${healthDate}-${Date.now()}`,
        date: healthDate,
        weightKg,
        heightCm,
        gender: healthGender,
        bmi
      };

      setHealthRecords((previous) =>
        [...previous, nextRecord].sort((left, right) => left.date.localeCompare(right.date))
      );
    };

    const onClearHealthRecords = () => {
      setHealthRecords([]);
    };

    const renderHealthChart = () => {
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
            `BMI ${typeof value === 'number' ? value : Number(value ?? 0)}`,
            `${message.tools.healthDimensions[healthDimension]} · ${item.payload.count}`
          ]}
        />
      );

      if (healthChartType === 'line') {
        return (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={healthTrendPoints} margin={{ top: 18, right: 12, bottom: 12, left: 0 }}>
              <defs>
                <linearGradient id="healthLineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ff9b5b" />
                  <stop offset="100%" stopColor="#48c8ff" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(75, 143, 189, 0.14)" vertical={false} />
              <XAxis {...sharedAxisProps} />
              <YAxis {...sharedYAxisProps} />
              {sharedTooltip}
              <Line type="monotone" dataKey="value" stroke="url(#healthLineGradient)" strokeWidth={4} dot={{ r: 5, fill: '#fff', stroke: '#ff9b5b', strokeWidth: 3 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      }

      if (healthChartType === 'bar') {
        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={healthTrendPoints} margin={{ top: 18, right: 12, bottom: 12, left: 0 }}>
              <defs>
                <linearGradient id="healthBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffb469" />
                  <stop offset="100%" stopColor="#58bfff" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(75, 143, 189, 0.14)" vertical={false} />
              <XAxis {...sharedAxisProps} />
              <YAxis {...sharedYAxisProps} />
              {sharedTooltip}
              <Bar dataKey="value" fill="url(#healthBarGradient)" radius={[10, 10, 4, 4]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        );
      }

      return (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={healthTrendPoints} margin={{ top: 18, right: 12, bottom: 12, left: 0 }}>
            <defs>
              <linearGradient id="healthAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#57b7ff" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#57b7ff" stopOpacity="0.06" />
              </linearGradient>
              <linearGradient id="healthAreaStrokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ff9b5b" />
                <stop offset="100%" stopColor="#48c8ff" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(75, 143, 189, 0.14)" vertical={false} />
            <XAxis {...sharedAxisProps} />
            <YAxis {...sharedYAxisProps} />
            {sharedTooltip}
            <Area type="monotone" dataKey="value" stroke="url(#healthAreaStrokeGradient)" strokeWidth={4} fill="url(#healthAreaGradient)" dot={{ r: 4, fill: '#fff', stroke: '#48c8ff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      );
    };

    return (
      <article className="tools-card tools-card-single tools-card-health">
        <div className="tools-health-sidebar">
          <h3>{message.tools.healthTitle}</h3>
          <p>{message.tools.healthDescription}</p>

          <div className="tools-health-form">
            <label className="tools-field">
              <span>{message.tools.healthDateLabel}</span>
              <input type="date" className="tools-input" value={healthDate} onChange={(event) => setHealthDate(event.target.value)} />
            </label>
            <label className="tools-field">
              <span>{message.tools.healthWeightLabel}</span>
              <input type="number" className="tools-input" value={healthWeight} onChange={(event) => setHealthWeight(event.target.value)} placeholder="78" />
            </label>
            <label className="tools-field">
              <span>{message.tools.healthHeightLabel}</span>
              <input type="number" className="tools-input" value={healthHeight} onChange={(event) => setHealthHeight(event.target.value)} placeholder="178" />
            </label>
            <label className="tools-field">
              <span>{message.tools.healthGenderLabel}</span>
              <select className="tools-input tools-select" value={healthGender} onChange={(event) => setHealthGender(event.target.value as HealthGender)}>
                <option value="male">{message.tools.healthGenderMale}</option>
                <option value="female">{message.tools.healthGenderFemale}</option>
                <option value="other">{message.tools.healthGenderOther}</option>
              </select>
            </label>
          </div>

          <div className="tools-health-summary">
            <div className={`tools-health-bmi-card is-${currentHealthRangeKey}`}>
              <span>{message.tools.healthBmiLabel}</span>
              <strong>{currentHealthBmi || '--'}</strong>
              <em>{message.tools.healthRanges[currentHealthRangeKey]}</em>
            </div>
            <p className="tools-health-range-copy">{message.tools.healthBmiRangeCopy}</p>
            <ul className="tools-health-range-list">
              <li>{message.tools.healthRangeUnderweight}</li>
              <li>{message.tools.healthRangeNormal}</li>
              <li>{message.tools.healthRangeOverweight}</li>
              <li>{message.tools.healthRangeObese}</li>
            </ul>
          </div>

          <div className="tools-actions tools-actions-three">
            <button type="button" className="world-action-button action-enter" onClick={onSaveHealthRecord}>
              {message.tools.healthSaveAction}
            </button>
            <button type="button" className="world-action-button world-action-button-alt action-rule" onClick={onClearHealthRecords}>
              {message.tools.healthClearAction}
            </button>
          </div>
        </div>

        <div className="tools-health-main">
          <div className="tools-health-chart-card">
            <div className="tools-health-chart-header">
              <div>
                <h4>{message.tools.healthTrendTitle}</h4>
                <p>{latestHealthRecord ? `${message.tools.healthLatestLabel}: BMI ${latestHealthRecord.bmi}` : message.tools.healthNoData}</p>
              </div>
              <div className="tools-health-chart-controls">
                <div className="tools-health-dimension-tabs">
                  {(['day', 'week', 'month', 'year'] as HealthDimension[]).map((dimension) => (
                    <button
                      key={dimension}
                      type="button"
                      className={`tools-health-dimension-tab ${healthDimension === dimension ? 'is-active' : ''}`}
                      onClick={() => setHealthDimension(dimension)}
                    >
                      {message.tools.healthDimensions[dimension]}
                    </button>
                  ))}
                </div>
                <div className="tools-health-dimension-tabs">
                  {(['area', 'line', 'bar'] as HealthChartType[]).map((chartType) => (
                    <button
                      key={chartType}
                      type="button"
                      className={`tools-health-dimension-tab ${healthChartType === chartType ? 'is-active' : ''}`}
                      onClick={() => setHealthChartType(chartType)}
                    >
                      {message.tools.healthChartTypes[chartType]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {healthTrendPoints.length > 0 ? (
              <div className="tools-health-chart-shell">
                {renderHealthChart()}
              </div>
            ) : (
              <p className="tools-preview-empty">{message.tools.healthNoData}</p>
            )}
          </div>

          <div className="tools-health-records-card">
            <div className="tools-health-chart-header">
              <div>
                <h4>{message.tools.healthRecordsTitle}</h4>
                <p>{message.tools.healthRecordsCount.replace('{count}', String(healthRecords.length))}</p>
              </div>
            </div>
            {healthRecords.length > 0 ? (
              <div className="tools-health-records-list">
                {healthRecords
                  .slice()
                  .reverse()
                  .map((record) => (
                    <article key={record.id} className="tools-health-record-item">
                      <div>
                        <strong>{record.date}</strong>
                        <p>{message.tools.healthGenderValue[record.gender]}</p>
                      </div>
                      <div>
                        <span>{record.weightKg} kg</span>
                        <span>{record.heightCm} cm</span>
                      </div>
                      <div className={`tools-health-record-bmi is-${getBmiRangeKey(record.bmi)}`}>
                        BMI {record.bmi}
                      </div>
                    </article>
                  ))}
              </div>
            ) : (
              <p className="tools-preview-empty">{message.tools.healthNoData}</p>
            )}
          </div>
        </div>
      </article>
    );
  };

  const activePanel = (() => {
    if (activeTool === 'html') {
      return renderHtmlTool();
    }
    if (activeTool === 'json') {
      return renderJsonTool();
    }
    if (activeTool === 'url') {
      return renderUrlTool();
    }
    if (activeTool === 'regex') {
      return renderRegexTool();
    }
    if (activeTool === 'markdown') {
      return renderMarkdownTool();
    }
    if (activeTool === 'chat') {
      return renderChatTool();
    }
    if (activeTool === 'health') {
      return renderHealthTool();
    }
    return renderOverview();
  })();

  return (
    <section className="tools-section screen-section is-revealed" id="tools">
      <header className="section-header section-header-tools">
        <p className="section-kicker">{message.tools.kicker}</p>
        <h2 className="section-title">{message.tools.title}</h2>
        <p className="tools-description">{message.tools.description}</p>
        <div className="tools-header-actions">
          <a className="hero-link hero-link-secondary tools-back-link" href={homeHref}>
            {message.tools.backHome}
          </a>
          <a className={`hero-link hero-link-secondary tools-back-link ${activeTool === 'overview' ? 'is-active' : ''}`} href={overviewHref}>
            {message.tools.overviewNav}
          </a>
        </div>
      </header>

      <nav className="tools-subnav" aria-label={message.tools.subRouteLabel}>
        <a className={`tools-subnav-item ${activeTool === 'html' ? 'is-active' : ''}`} href={htmlHref}>
          {message.tools.htmlNav}
        </a>
        <a className={`tools-subnav-item ${activeTool === 'json' ? 'is-active' : ''}`} href={jsonHref}>
          {message.tools.jsonNav}
        </a>
        <a className={`tools-subnav-item ${activeTool === 'url' ? 'is-active' : ''}`} href={urlHref}>
          {message.tools.urlNav}
        </a>
        <a className={`tools-subnav-item ${activeTool === 'regex' ? 'is-active' : ''}`} href={regexHref}>
          {message.tools.regexNav}
        </a>
        <a className={`tools-subnav-item ${activeTool === 'markdown' ? 'is-active' : ''}`} href={markdownHref}>
          {message.tools.markdownNav}
        </a>
        <a className={`tools-subnav-item ${activeTool === 'chat' ? 'is-active' : ''}`} href={chatHref}>
          {message.tools.chatNav}
        </a>
        <a className={`tools-subnav-item ${activeTool === 'health' ? 'is-active' : ''}`} href={healthHref}>
          {message.tools.healthNav}
        </a>
      </nav>

      <div className="tools-panel">{activePanel}</div>
    </section>
  );
};
