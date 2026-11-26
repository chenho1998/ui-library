import * as React from 'react';
import { Controls, Description, DocsContext, Primary, Stories } from '@storybook/addon-docs/blocks';
import {
  Badge, Button, CheckIcon, CopyIcon, ExternalLinkIcon, Kbd, Stack, Text, ThemeProvider, type ColorScheme,
} from '@yourorg/ui';
import { DocFooterNav, navigateTop, useDocsScheme } from './DocsChrome';
import {
  CURRENT_VERSION,
  componentRegistry,
  githubBlobUrl,
  githubHistoryUrl,
  type ComponentToken,
} from './componentRegistry';

function TokenSwatch({ token }: { token: ComponentToken }) {
  if (token.kind === 'color') {
    return (
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: 24,
          height: 24,
          borderRadius: 6,
          background: `var(${token.name})`,
          border: '1px solid var(--ui-color-border-strong)',
          flexShrink: 0,
        }}
      />
    );
  }
  if (token.kind === 'radius') {
    return (
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: 24,
          height: 24,
          borderRadius: `var(${token.name}, 8px)`,
          background: 'var(--ui-color-accent-subtle)',
          border: '2px solid var(--ui-color-accent)',
          flexShrink: 0,
        }}
      />
    );
  }
  if (token.kind === 'shadow') {
    return (
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: 24,
          height: 24,
          borderRadius: 6,
          background: 'var(--ui-color-surface)',
          boxShadow: `var(${token.name})`,
          border: '1px solid var(--ui-color-border)',
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
        borderRadius: 6,
        background: 'var(--ui-color-surface-subtle)',
        border: '1px solid var(--ui-color-border)',
        fontSize: 10,
        fontWeight: 700,
        color: 'var(--ui-color-text-secondary)',
        flexShrink: 0,
      }}
    >
      px
    </span>
  );
}

/**
 * Unified MUI-style documentation template rendered for every component in Storybook.
 * Features category eyebrow, clickable version/source/CSS URLs, copyable import bar,
 * live interactive playground, conditional API controls, examples, keyboard shortcuts,
 * live scoped Design Tokens, and Previous/Next pagination.
 */
export function ComponentDocPage() {
  const context = React.useContext(DocsContext);
  const scheme = useDocsScheme();
  const [copiedImport, setCopiedImport] = React.useState(false);
  const [copiedSnippet, setCopiedSnippet] = React.useState(false);
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null);

  const stories = context.componentStories();
  const primary = stories[0];
  const fullTitle = primary?.title ?? '';
  const parts = fullTitle.split('/');
  const category = parts.length > 1 ? parts.slice(0, -1).join(' / ') : 'Components';
  const name = parts[parts.length - 1] ?? 'Component';

  const meta = componentRegistry[fullTitle];
  const hasMultipleStories = stories.length > 1;

  // Render Controls table only when the primary story defines active interactive argTypes.
  const controlsDisabled = primary?.parameters?.controls?.disable === true;
  const hasControls =
    !controlsDisabled &&
    primary?.argTypes &&
    Object.values(primary.argTypes).some((arg) => arg && arg.control !== false && !arg.table?.disable);

  const importLine = meta
    ? `import { ${meta.imports.join(', ')} } from '${meta.packageName}';`
    : `import { ${name.replace(/\s+/g, '')} } from '@yourorg/ui';`;

  const copyImport = () => {
    void navigator.clipboard?.writeText(importLine);
    setCopiedImport(true);
    window.setTimeout(() => setCopiedImport(false), 1500);
  };

  const copySnippet = () => {
    if (!meta?.themeSnippet) return;
    void navigator.clipboard?.writeText(meta.themeSnippet);
    setCopiedSnippet(true);
    window.setTimeout(() => setCopiedSnippet(false), 1500);
  };

  const copyToken = (varName: string) => {
    void navigator.clipboard?.writeText(`var(${varName})`);
    setCopiedToken(varName);
    window.setTimeout(() => setCopiedToken(null), 1400);
  };

  return (
    <div className="ui-doc-page">
      <ThemeProvider colorScheme={scheme as ColorScheme} style={{ background: 'transparent' }}>
        {/* MUI-style Component Header */}
        <header
          style={{
            paddingBottom: 24,
            marginBottom: 28,
            borderBottom: '1px solid var(--ui-color-border)',
          }}
        >
          <Stack gap={3}>
            <Stack direction="row" gap={2} align="center" wrap>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  color: 'var(--ui-color-accent-text)',
                }}
              >
                {category}
              </span>
              <span style={{ color: 'var(--ui-color-border-strong)' }}>·</span>
              <Badge size="sm" tone="neutral" variant="outline">
                {meta?.packageName ?? '@yourorg/ui'}
              </Badge>
              {meta?.since === 'v0.3' ? (
                <Badge size="sm" tone="accent">New in v0.3</Badge>
              ) : null}
              {meta?.aria ? (
                <Badge size="sm" tone="success" variant="subtle">{meta.aria}</Badge>
              ) : null}
            </Stack>

            <div>
              <h1
                style={{
                  margin: '0 0 8px',
                  fontSize: 34,
                  lineHeight: 1.18,
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  color: 'var(--ui-color-text-primary)',
                }}
              >
                {name}
              </h1>
              {meta?.summary ? (
                <Text size="md" tone="secondary" style={{ margin: 0, maxWidth: 740, lineHeight: 1.6 }}>
                  {meta.summary}
                </Text>
              ) : (
                <Description />
              )}
            </div>

            {/* Version & source URL links bar */}
            <Stack direction="row" gap={2} align="center" wrap style={{ paddingTop: 2 }}>
              <a
                href={meta ? githubHistoryUrl(meta.sourcePath) : githubHistoryUrl('packages/ui/src/index.ts')}
                target="_blank"
                rel="noopener noreferrer"
                className="ui-doc-meta-link ui-doc-meta-link--version"
                title="View version & commit history on GitHub"
              >
                <span>{meta?.version ?? CURRENT_VERSION}</span>
                {meta ? <span className="ui-doc-meta-sub">since {meta.since}</span> : null}
                <ExternalLinkIcon size={12} />
              </a>

              {meta?.sourcePath ? (
                <a
                  href={githubBlobUrl(meta.sourcePath)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ui-doc-meta-link"
                >
                  <span>Source</span>
                  <ExternalLinkIcon size={12} />
                </a>
              ) : null}

              {meta?.cssPath ? (
                <a
                  href={githubBlobUrl(meta.cssPath)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ui-doc-meta-link"
                >
                  <span>Stylesheet</span>
                  <ExternalLinkIcon size={12} />
                </a>
              ) : null}

              {primary?.id ? (
                <a
                  href={`?path=/story/${primary.id}`}
                  target="_top"
                  className="ui-doc-meta-link"
                >
                  <span>Open canvas</span>
                  <ExternalLinkIcon size={12} />
                </a>
              ) : null}

              <button
                type="button"
                className="ui-doc-meta-link"
                onClick={() => navigateTop('?path=/docs/getting-started-migration-guide--docs')}
              >
                Changelog &amp; Migration
              </button>
            </Stack>

            {/* Quick copyable import snippet */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '9px 12px 9px 14px',
                borderRadius: 10,
                border: '1px solid var(--ui-color-border)',
                background: 'var(--ui-color-surface-subtle)',
                marginTop: 4,
              }}
            >
              <code
                style={{
                  fontFamily: 'var(--ui-font-mono)',
                  fontSize: 12.5,
                  color: 'var(--ui-color-text-primary)',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                }}
              >
                {importLine}
              </code>
              <Button
                size="sm"
                variant="ghost"
                tone="neutral"
                startIcon={copiedImport ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                onClick={copyImport}
              >
                {copiedImport ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </Stack>
        </header>
      </ThemeProvider>

      {/* Primary live interactive preview */}
      <h2 id="preview" className="ui-doc-section-heading">Preview</h2>
      <Primary />

      {/* Interactive Props / API controls (shown only when component defines args) */}
      {hasControls ? (
        <>
          <h2 id="api" className="ui-doc-section-heading">API &amp; props</h2>
          <Controls />
        </>
      ) : null}

      {/* Additional stories/examples */}
      {hasMultipleStories ? (
        <Stories title="Examples" includePrimary={false} />
      ) : null}

      {/* Keyboard & Accessibility reference table (MUI / Radix pattern) */}
      {meta?.keyboard && meta.keyboard.length > 0 ? (
        <ThemeProvider colorScheme={scheme as ColorScheme} style={{ background: 'transparent', marginTop: 32 }}>
          <section aria-labelledby="keyboard-heading">
            <h2 id="keyboard-heading" className="ui-doc-section-heading" style={{ marginBottom: 10 }}>
              Keyboard &amp; accessibility
            </h2>
            <div
              style={{
                border: '1px solid var(--ui-color-border)',
                borderRadius: 12,
                overflow: 'hidden',
                background: 'var(--ui-color-surface)',
              }}
            >
              {meta.keyboard.map((item, idx) => (
                <div
                  key={item.keys.join('+')}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(150px, 210px) 1fr',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    borderTop: idx === 0 ? undefined : '1px solid var(--ui-color-border)',
                  }}
                >
                  <Stack direction="row" gap={1} align="center" wrap>
                    {item.keys.map((k) => (
                      <Kbd key={k}>{k}</Kbd>
                    ))}
                  </Stack>
                  <Text size="sm" tone="secondary">{item.action}</Text>
                </div>
              ))}
            </div>
          </section>
        </ThemeProvider>
      ) : null}

      {/* Scoped Design Tokens section (omitted on the full Design Tokens explorer page itself) */}
      {meta && meta.tokens.length > 0 && fullTitle !== 'Foundations/Design tokens' ? (
        <ThemeProvider colorScheme={scheme as ColorScheme} style={{ background: 'transparent', marginTop: 36 }}>
          <section aria-labelledby="design-tokens-heading">
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div>
                <h2 id="design-tokens-heading" className="ui-doc-section-heading" style={{ margin: 0 }}>
                  Design tokens
                </h2>
                <Text size="sm" tone="secondary" style={{ marginTop: 4 }}>
                  CSS variables consumed by {name}. Click any token to copy — values update automatically across all 8 themes and dark mode.
                </Text>
              </div>
              <Button
                size="sm"
                variant="outline"
                tone="neutral"
                onClick={() => navigateTop('?path=/docs/foundations-design-tokens--docs')}
              >
                Explore all tokens
              </Button>
            </div>

            <div
              style={{
                border: '1px solid var(--ui-color-border)',
                borderRadius: 12,
                overflow: 'hidden',
                background: 'var(--ui-color-surface)',
              }}
            >
              {meta.tokens.map((tok, i) => (
                <div
                  key={tok.name}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '32px minmax(190px, 240px) 1fr auto',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    borderTop: i === 0 ? undefined : '1px solid var(--ui-color-border)',
                  }}
                >
                  <TokenSwatch token={tok} />
                  <code
                    style={{
                      fontFamily: 'var(--ui-font-mono)',
                      fontSize: 12.5,
                      color: 'var(--ui-color-text-primary)',
                    }}
                  >
                    {tok.name}
                  </code>
                  <Text size="sm" tone="secondary">{tok.role}</Text>
                  <Button
                    size="sm"
                    variant="ghost"
                    tone="neutral"
                    startIcon={copiedToken === tok.name ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
                    onClick={() => copyToken(tok.name)}
                  >
                    {copiedToken === tok.name ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              ))}
            </div>

            {meta.themeSnippet ? (
              <div
                style={{
                  marginTop: 12,
                  padding: '10px 14px 12px',
                  borderRadius: 10,
                  border: '1px solid var(--ui-color-border)',
                  background: 'var(--ui-color-surface-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text size="xs" weight="semibold" tone="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Customize with createTheme()
                  </Text>
                  <Button
                    size="sm"
                    variant="ghost"
                    tone="neutral"
                    startIcon={copiedSnippet ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
                    onClick={copySnippet}
                  >
                    {copiedSnippet ? 'Copied' : 'Copy'}
                  </Button>
                </div>
                <pre style={{ margin: 0, fontFamily: 'var(--ui-font-mono)', fontSize: 12.5, lineHeight: 1.55, overflowX: 'auto', color: 'var(--ui-color-text-primary)' }}>
                  <code>{meta.themeSnippet}</code>
                </pre>
              </div>
            ) : null}
          </section>
        </ThemeProvider>
      ) : null}

      {/* Previous / Next page navigation */}
      <DocFooterNav currentTitle={fullTitle} />
    </div>
  );
}
