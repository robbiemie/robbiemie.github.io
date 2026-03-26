import { type ReactNode, useDeferredValue, useMemo, useRef, useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { withErrorBoundary } from '../../common/WithErrorBoundary';

type MarkdownRendererToolProps = {
  title: string;
  description: string;
  sourceLabel: string;
  previewLabel: string;
  placeholder: string;
  emptyText: string;
  copyAction: string;
  clearAction: string;
  exampleAction: string;
  copyMarkdownAction: string;
  copyRenderedAction: string;
  copyCodeAction: string;
  copySuccessText: string;
  copyFailedText: string;
};

type CopyableCodeBlockProps = {
  className?: string;
  children?: ReactNode;
  copyCodeAction: string;
  copySuccessText: string;
  copyFailedText: string;
};

const MARKDOWN_EXAMPLE = `# Markdown Playground

Build readable documentation with:

- GFM tables
- task lists
- syntax-highlighted code

## Task Checklist

- [x] Parse markdown
- [x] Keep layout scrollable
- [x] Support copy interactions

## TypeScript Example

\`\`\`ts
type UserProfile = {
  id: string;
  displayName: string;
  tags: string[];
};

const formatProfile = (profile: UserProfile): string => {
  return \`\${profile.displayName} · \${profile.tags.join(', ')}\`;
};
\`\`\`

## Table

| Field | Value |
| --- | --- |
| Parser | react-markdown |
| GFM | enabled |
| HTML | sanitized |

> This panel is selectable, so the rendered document can be copied directly.

<details>
  <summary>Inline HTML is supported after sanitization</summary>
  <p>Unsafe tags and attributes are filtered out.</p>
</details>
`;

const markdownSanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), ['className']],
    span: [...(defaultSchema.attributes?.span ?? []), ['className']],
    div: [...(defaultSchema.attributes?.div ?? []), ['className']]
  }
};

const copyText = async (content: string): Promise<boolean> => {
  if (!content.trim()) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch {
    return false;
  }
};

const extractPreviewText = (container: HTMLElement | null): string => {
  if (!container) {
    return '';
  }

  const clonedContainer = container.cloneNode(true) as HTMLElement;
  clonedContainer.querySelectorAll('[data-copy-control="true"]').forEach((element) => {
    element.remove();
  });

  return clonedContainer.innerText.trim();
};

const getCodeText = (children: ReactNode): string => {
  if (typeof children === 'string') {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map((item) => getCodeText(item)).join('');
  }

  if (children && typeof children === 'object' && 'props' in children) {
    return getCodeText((children as { props?: { children?: ReactNode } }).props?.children ?? '');
  }

  return '';
};

const CopyableCodeBlock = ({
  className,
  children,
  copyCodeAction,
  copySuccessText,
  copyFailedText
}: CopyableCodeBlockProps) => {
  const [copyFeedback, setCopyFeedback] = useState('');

  const onCopyCode = async () => {
    const success = await copyText(getCodeText(children));
    setCopyFeedback(success ? copySuccessText : copyFailedText);
    window.setTimeout(() => {
      setCopyFeedback('');
    }, 1800);
  };

  return (
    <div className="markdown-renderer-code-shell">
      <button type="button" className="markdown-renderer-code-copy" data-copy-control="true" onClick={() => void onCopyCode()}>
        {copyFeedback || copyCodeAction}
      </button>
      <pre className={className}>
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
};

const MarkdownRendererToolBase = ({
  title,
  description,
  sourceLabel,
  previewLabel,
  placeholder,
  emptyText,
  copyAction,
  clearAction,
  exampleAction,
  copyMarkdownAction,
  copyRenderedAction,
  copyCodeAction,
  copySuccessText,
  copyFailedText
}: MarkdownRendererToolProps) => {
  const [markdownSource, setMarkdownSource] = useState(MARKDOWN_EXAMPLE);
  const [copyFeedback, setCopyFeedback] = useState('');
  const previewRef = useRef<HTMLElement | null>(null);
  const deferredMarkdownSource = useDeferredValue(markdownSource);

  const markdownComponents = useMemo<Components>(() => {
    return {
      code(props) {
        const { inline, className, children, ...rest } = props as any;

        if (inline) {
          return (
            <code className={className} {...rest}>
              {children}
            </code>
          );
        }

        return (
          <CopyableCodeBlock
            className={className}
            copyCodeAction={copyCodeAction}
            copySuccessText={copySuccessText}
            copyFailedText={copyFailedText}
          >
            {children}
          </CopyableCodeBlock>
        );
      },
      a(props) {
        return <a {...props} target="_blank" rel="noreferrer" />;
      }
    };
  }, [copyCodeAction, copyFailedText, copySuccessText]);

  const updateCopyFeedback = (nextFeedback: string) => {
    setCopyFeedback(nextFeedback);
    window.setTimeout(() => {
      setCopyFeedback('');
    }, 1800);
  };

  const onLoadExample = () => {
    setMarkdownSource(MARKDOWN_EXAMPLE);
  };

  const onClear = () => {
    setMarkdownSource('');
    setCopyFeedback('');
  };

  const onCopyMarkdown = async () => {
    const success = await copyText(markdownSource);
    updateCopyFeedback(success ? copySuccessText : copyFailedText);
  };

  const onCopyRendered = async () => {
    const renderedText = extractPreviewText(previewRef.current);
    const success = await copyText(renderedText);
    updateCopyFeedback(success ? copySuccessText : copyFailedText);
  };

  return (
    <article className="tools-card tools-card-markdown">
      <section className="markdown-renderer-panel">
        <div className="markdown-renderer-panel-header">
          <div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
          <div className="tools-actions tools-actions-three markdown-renderer-actions">
            <button type="button" className="world-action-button action-history" onClick={onLoadExample}>
              {exampleAction}
            </button>
            <button type="button" className="world-action-button world-action-button-alt action-rule" onClick={onClear}>
              {clearAction}
            </button>
            <button type="button" className="world-action-button world-action-button-alt action-enter" onClick={() => void onCopyMarkdown()}>
              {copyMarkdownAction}
            </button>
          </div>
        </div>
        <label className="tools-field markdown-renderer-field">
          <span>{sourceLabel}</span>
          <textarea
            className="markdown-renderer-textarea"
            value={markdownSource}
            onChange={(event) => setMarkdownSource(event.target.value)}
            placeholder={placeholder}
            spellCheck={false}
          />
        </label>
      </section>

      <section className="markdown-renderer-panel markdown-renderer-preview-panel">
        <div className="markdown-renderer-panel-header">
          <div>
            <h3>{previewLabel}</h3>
            <p>{copyFeedback || emptyText}</p>
          </div>
          <button type="button" className="world-action-button action-enter markdown-renderer-rendered-copy" onClick={() => void onCopyRendered()}>
            {copyRenderedAction || copyAction}
          </button>
        </div>

        <div className="markdown-renderer-preview-scroll">
          {deferredMarkdownSource.trim() ? (
            <article className="markdown-renderer-preview-content" ref={previewRef}>
              <ReactMarkdown
                components={markdownComponents}
                remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeRaw, [rehypeSanitize, markdownSanitizeSchema], rehypeHighlight]}
              >
                {deferredMarkdownSource}
              </ReactMarkdown>
            </article>
          ) : (
            <p className="tools-preview-empty">{emptyText}</p>
          )}
        </div>
      </section>
    </article>
  );
};

export const MarkdownRendererTool = withErrorBoundary(
  MarkdownRendererToolBase,
  <article className="tools-card tools-card-single">
    <h3>Markdown Renderer</h3>
    <p>Markdown render failed. Refresh the page and retry.</p>
  </article>
);

export default MarkdownRendererTool;
