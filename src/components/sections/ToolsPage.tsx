import { useMemo, useState } from 'react';
import { useI18n } from '../../i18n/locale-context';

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

export type ToolsRouteKey = 'overview' | 'html' | 'json' | 'url';

type ToolsPageProps = {
  activeTool: ToolsRouteKey;
};

const getRouteHref = (segment: '' | 'tools' | 'tools/html' | 'tools/json' | 'tools/url'): string => {
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

export const ToolsPage = ({ activeTool }: ToolsPageProps) => {
  const { message } = useI18n();
  const homeHref = useMemo(() => getRouteHref(''), []);
  const overviewHref = useMemo(() => getRouteHref('tools'), []);
  const htmlHref = useMemo(() => getRouteHref('tools/html'), []);
  const jsonHref = useMemo(() => getRouteHref('tools/json'), []);
  const urlHref = useMemo(() => getRouteHref('tools/url'), []);

  const [htmlSource, setHtmlSource] = useState('');
  const [htmlOutput, setHtmlOutput] = useState('');
  const [htmlValidationMessage, setHtmlValidationMessage] = useState('');
  const [htmlValidationPassed, setHtmlValidationPassed] = useState<boolean | null>(null);

  const [jsonSource, setJsonSource] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonValidationMessage, setJsonValidationMessage] = useState('');
  const [jsonValidationPassed, setJsonValidationPassed] = useState<boolean | null>(null);

  const [urlSource, setUrlSource] = useState('');
  const [urlOutput, setUrlOutput] = useState('');

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
    setHtmlValidationMessage('');
    setHtmlValidationPassed(null);
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
      </div>
    );
  };

  const renderHtmlTool = () => {
    return (
      <article className="tools-card tools-card-single">
        <h3>{message.tools.formatterTitle}</h3>
        <p>{message.tools.formatterDescription}</p>
        <label className="tools-field">
          <span>{message.tools.sourceLabel}</span>
          <textarea value={htmlSource} onChange={(event) => setHtmlSource(event.target.value)} placeholder={message.tools.sourcePlaceholder} />
        </label>
        <div className="tools-actions tools-actions-three">
          <button type="button" className="world-action-button action-enter" onClick={onFormatHtml}>
            {message.tools.formatAction}
          </button>
          <button type="button" className="world-action-button action-spin" onClick={onValidateHtml}>
            {message.tools.validateAction}
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
        <div className="tools-actions tools-actions-three">
          <button type="button" className="world-action-button action-enter" onClick={onFormatJson}>
            {message.tools.jsonFormatAction}
          </button>
          <button type="button" className="world-action-button action-spin" onClick={onValidateJson}>
            {message.tools.jsonValidateAction}
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
      </nav>

      <div className="tools-panel">{activePanel}</div>
    </section>
  );
};
