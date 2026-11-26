import * as React from 'react';
import {
  Alert, Badge, Banner, Button, Card, ChartIcon, CheckIcon, CopyIcon, ExternalLinkIcon, FolderIcon, Grid, Heading,
  HomeIcon, MoonIcon, Progress, SettingsIcon, Stack, SunIcon, Switch, Text, TextField, ThemeProvider, animeTheme,
  brutalistTheme, neonTheme, pixelTheme, sketchTheme, toast, type ColorScheme, type Theme,
} from '@yourorg/ui';
import { useDocsScheme } from './DocsChrome';

function CodeGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

/** Lightweight TSX/Bash syntax highlighter (zero dependencies) for crisp dark code drawers. */
function highlightLine(line: string, lang: 'tsx' | 'bash' = 'tsx'): React.ReactNode[] {
  if (lang === 'bash') {
    if (line.trimStart().startsWith('#')) {
      return [<span key="c" style={{ color: '#64748b', fontStyle: 'italic' }}>{line}</span>];
    }
    const parts = line.split(/^(\s*(?:pnpm|npm|yarn)\b)/);
    return parts.map((p, i) =>
      i === 1 ? (
        <span key={i} style={{ color: '#7dd3fc', fontWeight: 600 }}>{p}</span>
      ) : (
        <span key={i} style={{ color: '#e2e8f0' }}>{p}</span>
      ),
    );
  }

  const tokenRe =
    /(\/\/.*$|'[^']*'|"[^"]*"|`[^`]*`|\b(?:import|export|from|const|let|return|function|true|false|null|undefined)\b|<\/?[A-Z][A-Za-z0-9.]*|<\/?[a-z][a-z0-9-]*|\b[a-zA-Z_][a-zA-Z0-9_-]*(?==))/g;
  const out: React.ReactNode[] = [];
  let last = 0;
  let idx = 0;
  for (const m of line.matchAll(tokenRe)) {
    const start = m.index ?? 0;
    if (start > last) out.push(<span key={idx++} style={{ color: '#cbd5e1' }}>{line.slice(last, start)}</span>);
    const tok = m[0];
    let color: string;
    let fontStyle: React.CSSProperties['fontStyle'];
    if (tok.startsWith('//')) {
      color = '#64748b';
      fontStyle = 'italic';
    } else if (tok.startsWith("'") || tok.startsWith('"') || tok.startsWith('`')) {
      color = '#86efac';
    } else if (tok.startsWith('<')) {
      color = '#7dd3fc';
    } else if (/^(import|export|from|const|let|return|function|true|false|null|undefined)$/.test(tok)) {
      color = '#f472b6';
    } else {
      color = '#c4b5fd';
    }
    out.push(<span key={idx++} style={{ color, fontStyle }}>{tok}</span>);
    last = start + tok.length;
  }
  if (last < line.length) out.push(<span key={idx} style={{ color: '#cbd5e1' }}>{line.slice(last)}</span>);
  return out.length ? out : [<span key="empty">&nbsp;</span>];
}

function SyntaxCodeBlock({ code, lang = 'tsx' }: { code: string; lang?: 'tsx' | 'bash' }) {
  const lines = code.trimEnd().split('\n');
  return (
    <div
      style={{
        background: '#0b0f19',
        borderTop: '1px solid #1d2538',
        color: '#e2e8f0',
      }}
    >
      <pre
        style={{
          margin: 0,
          padding: '14px 16px',
          fontFamily: 'var(--ui-font-mono)',
          fontSize: 12.5,
          lineHeight: 1.65,
          overflowX: 'auto',
        }}
      >
        <code>
          {lines.map((line, i) => (
            <div key={i} style={{ display: 'flex', gap: 16 }}>
              <span
                aria-hidden="true"
                style={{
                  minWidth: 18,
                  textAlign: 'right',
                  color: '#475569',
                  userSelect: 'none',
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span style={{ whiteSpace: 'pre' }}>{highlightLine(line, lang)}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

/**
 * MUI/Vercel-style framed preview card for Storybook stories:
 * clean header bar, solid stage, unified bottom Show Code / Copy Code bar, and syntax-highlighted code drawer.
 */
export function DemoFrame({
  title,
  description,
  badge,
  actions,
  code,
  flush,
  maxWidth,
  children,
}: {
  title: string;
  description?: string;
  badge?: string;
  actions?: React.ReactNode;
  code?: string;
  flush?: boolean;
  maxWidth?: number | string;
  children: React.ReactNode;
}) {
  const [showCode, setShowCode] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const copy = () => {
    if (!code) return;
    void navigator.clipboard?.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className={code ? 'ui-demo-frame ui-demo-frame--has-code' : 'ui-demo-frame'}
      style={{
        maxWidth: maxWidth ?? 960,
        border: '1px solid var(--ui-color-border)',
        borderRadius: 14,
        background: 'var(--ui-color-surface)',
        boxShadow: 'var(--ui-shadow-sm)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '12px 18px',
          borderBottom: '1px solid var(--ui-color-border)',
          background: 'var(--ui-color-surface-subtle)',
        }}
      >
        <div style={{ display: 'grid', gap: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text size="sm" weight="semibold">{title}</Text>
            {badge ? <Badge size="sm" tone="accent">{badge}</Badge> : null}
          </div>
          {description ? <Text size="xs" tone="secondary">{description}</Text> : null}
        </div>
        {actions ? <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{actions}</div> : null}
      </div>

      <div
        style={{
          padding: flush ? 0 : 28,
          background: 'var(--ui-color-surface)',
        }}
      >
        {children}
      </div>

      {code ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '8px 14px',
            borderTop: '1px solid var(--ui-color-border)',
            background: 'var(--ui-color-surface-subtle)',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                padding: '2px 6px',
                borderRadius: 5,
                border: '1px solid var(--ui-color-border)',
                background: 'var(--ui-color-surface)',
                color: 'var(--ui-color-text-secondary)',
                fontFamily: 'var(--ui-font-mono)',
                fontSize: 10.5,
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}
            >
              TSX
            </span>
            <Text size="xs" tone="secondary">
              React · TypeScript · {code.trimEnd().split('\n').length}{' '}
              {code.trimEnd().split('\n').length === 1 ? 'line' : 'lines'}
            </Text>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              onClick={() => setShowCode((v) => !v)}
              aria-expanded={showCode}
              className={`ui-demo-code-btn${showCode ? ' is-active' : ''}`}
            >
              <CodeGlyph />
              <span>{showCode ? 'Hide code' : 'Show code'}</span>
            </button>
            <button
              type="button"
              onClick={copy}
              className={`ui-demo-code-btn${copied ? ' is-copied' : ''}`}
            >
              {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
              <span>{copied ? 'Copied!' : 'Copy code'}</span>
            </button>
          </div>
        </div>
      ) : null}

      {code && showCode ? <SyntaxCodeBlock code={code} /> : null}
    </div>
  );
}

const themeChoices: Array<{ id: string; label: string; theme?: Theme; snippet: string }> = [
  { id: 'default', label: 'Default', snippet: '<ThemeProvider>' },
  { id: 'anime', label: 'Anime', theme: animeTheme, snippet: '<ThemeProvider theme={animeTheme}>' },
  { id: 'pixel', label: 'Pixel', theme: pixelTheme, snippet: '<ThemeProvider theme={pixelTheme}>' },
  { id: 'brutalist', label: 'Brutalist', theme: brutalistTheme, snippet: '<ThemeProvider theme={brutalistTheme}>' },
  { id: 'sketch', label: 'Sketch', theme: sketchTheme, snippet: '<ThemeProvider theme={sketchTheme}>' },
  { id: 'neon', label: 'Neon', theme: neonTheme, snippet: '<ThemeProvider theme={neonTheme}>' },
];

const installCommands = {
  pnpm: 'pnpm add @yourorg/ui\n# Optional standalone icons package:\npnpm add @yourorg/icons',
  npm: 'npm install @yourorg/ui\n# Optional standalone icons package:\nnpm install @yourorg/icons',
  yarn: 'yarn add @yourorg/ui\n# Optional standalone icons package:\nyarn add @yourorg/icons',
} as const;

const guideCards = [
  {
    title: 'Themes Gallery',
    badge: '8 themes',
    desc: 'Compare Default, Violet, Teal, Anime, Pixel, Brutalist, Sketch and Neon side by side.',
    href: '?path=/story/getting-started-themes--gallery',
    icon: <SunIcon size="sm" />,
  },
  {
    title: 'Design Tokens',
    badge: 'OKLCH',
    desc: 'Interactive explorer for WCAG AA semantic colours, palettes, typography, radius and spacing.',
    href: '?path=/docs/foundations-design-tokens--docs',
    icon: <ChartIcon size="sm" />,
  },
  {
    title: 'Icons Library',
    badge: '40 icons',
    desc: 'Search and copy tree-shakeable SVG icons from @yourorg/icons or build your own.',
    href: '?path=/docs/foundations-icons--docs',
    icon: <FolderIcon size="sm" />,
  },
  {
    title: 'App Shell Template',
    badge: 'Live demo',
    desc: 'Full workspace dashboard with Sidebar, Banner, CommandPalette, Stats and Timeline.',
    href: '?path=/story/templates-app-shell--dashboard',
    icon: <HomeIcon size="sm" />,
  },
  {
    title: 'Usage Guidelines',
    badge: 'Guide',
    desc: 'When to pick Banner vs Alert vs Toast, DataTable vs Table, accessibility & SSR.',
    href: '?path=/docs/getting-started-usage-guidelines--docs',
    icon: <SettingsIcon size="sm" />,
  },
  {
    title: 'Migration Guide',
    badge: 'v0.3',
    desc: 'Upgrading to v0.3, standalone @yourorg/icons, lighter primitives and new APIs.',
    href: '?path=/docs/getting-started-migration-guide--docs',
    icon: <ExternalLinkIcon size="sm" />,
  },
];

/**
 * MUI-inspired Docs landing experience rendered at the top of Introduction.mdx:
 * hero header, metrics strip, interactive live theme playground, quick-install tabs and start-here grid.
 */
export function IntroLanding() {
  const docsScheme = useDocsScheme();
  const [selectedTheme, setSelectedTheme] = React.useState('default');
  const [schemeOverride, setSchemeOverride] = React.useState<ColorScheme | null>(null);
  const [pkgMgr, setPkgMgr] = React.useState<'pnpm' | 'npm' | 'yarn'>('pnpm');
  const [copiedCmd, setCopiedCmd] = React.useState(false);
  const [progress, setProgress] = React.useState(68);
  const [notified, setNotified] = React.useState(true);

  const scheme: ColorScheme = schemeOverride ?? docsScheme;
  const setScheme = (next: ColorScheme | ((prev: ColorScheme) => ColorScheme)) => {
    setSchemeOverride((prev) => {
      const current = prev ?? docsScheme;
      return typeof next === 'function' ? next(current) : next;
    });
  };

  const active = themeChoices.find((t) => t.id === selectedTheme) ?? themeChoices[0]!;

  const navigate = (href: string) => {
    if (typeof window !== 'undefined') {
      const target = window.top ?? window;
      target.location.href = `${target.location.pathname}${href}`;
    }
  };

  const copyInstall = () => {
    void navigator.clipboard?.writeText(installCommands[pkgMgr]);
    setCopiedCmd(true);
    window.setTimeout(() => setCopiedCmd(false), 1500);
  };

  return (
    <ThemeProvider colorScheme={docsScheme} style={{ background: 'transparent' }}>
      <Stack gap={8} style={{ marginBottom: 32 }}>
        {/* Hero section */}
        <div
          style={{
            position: 'relative',
            padding: '36px 32px',
            borderRadius: 18,
            border: '1px solid var(--ui-color-border)',
            background:
              docsScheme === 'dark'
                ? 'radial-gradient(640px 260px at 90% -15%, rgba(76, 125, 254, 0.2), transparent 65%), linear-gradient(180deg, #101420 0%, #0b0e16 100%)'
                : 'radial-gradient(640px 260px at 92% -10%, color-mix(in srgb, var(--ui-color-accent) 14%, transparent), transparent 65%), linear-gradient(180deg, var(--ui-color-surface) 0%, var(--ui-color-surface-subtle) 100%)',
            boxShadow: 'var(--ui-shadow-sm)',
          }}
        >
          <Stack gap={4}>
            <Stack direction="row" gap={2} align="center" wrap>
              <Badge tone="accent" variant="subtle">v0.3</Badge>
              <Badge tone="neutral" variant="outline">50 Components</Badge>
              <Badge tone="neutral" variant="outline">40 Icons</Badge>
              <Badge tone="success" variant="subtle">114 Tests · WCAG AA</Badge>
            </Stack>

            <div style={{ maxWidth: 680 }}>
              <Heading level={1} size="4xl" style={{ margin: '0 0 10px', letterSpacing: '-0.03em' }}>
                Build accessible, themeable React interfaces faster
              </Heading>
              <Text size="lg" tone="secondary" style={{ margin: 0 }}>
                A complete React 18/19 component library powered by OKLCH design tokens, CSS cascade layers, Radix focus
                &amp; ARIA primitives, and one-prop expressive themes.
              </Text>
            </div>

            <Stack direction="row" gap={3} align="center" wrap style={{ paddingTop: 4 }}>
              <Button onClick={() => navigate('?path=/story/templates-app-shell--dashboard')}>
                Explore App Shell
              </Button>
              <Button variant="outline" tone="neutral" onClick={() => navigate('?path=/story/getting-started-themes--gallery')}>
                Browse Themes
              </Button>
              <Button variant="ghost" tone="neutral" onClick={() => navigate('?path=/docs/foundations-design-tokens--docs')}>
                Design Tokens
              </Button>
              <Button
                asChild
                variant="link"
                tone="neutral"
                endIcon={<ExternalLinkIcon size={14} />}
              >
                <a href="https://github.com/chenho1998/ui-library" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </Button>
            </Stack>
          </Stack>
        </div>

        {/* Interactive live theme showcase */}
        <DemoFrame
          title="Interactive theme switcher"
          description="Try switching themes and light/dark mode — every control updates from one ThemeProvider prop."
          badge={active.snippet}
          flush
          actions={
            <Stack direction="row" gap={1} align="center" wrap>
              {themeChoices.map((t) => (
                <Button
                  key={t.id}
                  size="sm"
                  variant={selectedTheme === t.id ? 'solid' : 'ghost'}
                  tone={selectedTheme === t.id ? 'accent' : 'neutral'}
                  onClick={() => {
                    setSelectedTheme(t.id);
                    if (t.id === 'neon') setScheme('dark');
                  }}
                >
                  {t.label}
                </Button>
              ))}
              <Button
                size="sm"
                variant="outline"
                tone="neutral"
                aria-label="Toggle light or dark scheme"
                startIcon={scheme === 'dark' ? <SunIcon size={14} /> : <MoonIcon size={14} />}
                onClick={() => setScheme((s) => (s === 'dark' ? 'light' : 'dark'))}
              >
                {scheme === 'dark' ? 'Light' : 'Dark'}
              </Button>
            </Stack>
          }
        >
          <ThemeProvider theme={active.theme} colorScheme={scheme} style={{ padding: 24 }}>
            <Stack gap={4}>
              <Banner
                tone="accent"
                title="Live preview"
                action={
                  <Button size="sm" variant="outline" tone="neutral" onClick={() => setProgress((p) => (p >= 100 ? 25 : p + 16))}>
                    Advance progress
                  </Button>
                }
              >
                Everything inside this frame uses <code>{active.snippet}</code> in {scheme} mode.
              </Banner>
              <Grid minChildWidth="320px" gap={4}>
                <Card variant="outline">
                  <Card.Header>
                    <Card.Title level={3}>Release settings</Card.Title>
                    <Card.Description>Changes apply immediately across your workspace.</Card.Description>
                  </Card.Header>
                  <Stack gap={3}>
                    <TextField label="Workspace name" defaultValue="Acme Design System" />
                    <Switch
                      label="Auto-publish Storybook"
                      description="Deploy GitHub Pages on merge to main."
                      checked={notified}
                      onCheckedChange={setNotified}
                    />
                    <Stack direction="row" gap={2}>
                      <Button size="sm" onClick={() => toast.success('Settings saved')}>Save</Button>
                      <Button size="sm" variant="outline" tone="neutral">Cancel</Button>
                    </Stack>
                  </Stack>
                </Card>
                <Card variant="outline">
                  <Card.Header>
                    <Card.Title level={3}>Build health</Card.Title>
                    <Card.Description>Automated contrast, a11y and bundle budgets.</Card.Description>
                  </Card.Header>
                  <Stack gap={3}>
                    <Progress label="CSS budget (13.6 / 16 KB)" value={progress} showValue />
                    <Stack direction="row" gap={2} wrap>
                      <Badge tone="success">114 tests</Badge>
                      <Badge tone="info">16 visual checks</Badge>
                      <Badge tone="accent">Tree-shakeable</Badge>
                    </Stack>
                    <Alert tone="success" title="All contrast checks passed">
                      30 semantic token pairs verified in light and dark.
                    </Alert>
                  </Stack>
                </Card>
              </Grid>
            </Stack>
          </ThemeProvider>
        </DemoFrame>

        {/* Quick Install bar with package-manager tabs & dark terminal block */}
        <div
          style={{
            border: '1px solid var(--ui-color-border)',
            borderRadius: 12,
            overflow: 'hidden',
            background: '#0b0f19',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderBottom: '1px solid #1d2538',
              background: '#0e1320',
            }}
          >
            <Stack direction="row" gap={1}>
              {(['pnpm', 'npm', 'yarn'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPkgMgr(m)}
                  style={{
                    height: 26,
                    padding: '0 10px',
                    borderRadius: 6,
                    border: `1px solid ${pkgMgr === m ? '#3b5bdb' : 'transparent'}`,
                    background: pkgMgr === m ? '#1a274c' : 'transparent',
                    color: pkgMgr === m ? '#bfdbfe' : '#94a3b8',
                    fontFamily: 'var(--ui-font-mono)',
                    fontSize: 12,
                    fontWeight: pkgMgr === m ? 600 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {m}
                </button>
              ))}
            </Stack>
            <button
              type="button"
              onClick={copyInstall}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                height: 26,
                padding: '0 10px',
                borderRadius: 6,
                border: `1px solid ${copiedCmd ? '#166534' : '#26314a'}`,
                background: copiedCmd ? '#0d2a1b' : '#141b2c',
                color: copiedCmd ? '#86efac' : '#cbd5e1',
                fontFamily: 'inherit',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {copiedCmd ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
              <span>{copiedCmd ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <pre style={{ margin: 0, padding: '14px 18px', fontFamily: 'var(--ui-font-mono)', fontSize: 13, lineHeight: 1.65 }}>
            <code>
              {installCommands[pkgMgr].split('\n').map((line, i) => (
                <div key={i}>{highlightLine(line, 'bash')}</div>
              ))}
            </code>
          </pre>
        </div>

        {/* Start here card grid */}
        <Stack gap={3}>
          <Heading level={2} size="xl" style={{ margin: 0 }}>Start exploring</Heading>
          <Grid minChildWidth="260px" gap={4}>
            {guideCards.map((item) => (
              <Card
                key={item.title}
                variant="outline"
                padding="sm"
                interactive
                role="button"
                tabIndex={0}
                onClick={() => navigate(item.href)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(item.href);
                  }
                }}
              >
                <Stack gap={2}>
                  <Stack direction="row" justify="between" align="center">
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: 'var(--ui-color-accent-subtle)',
                        color: 'var(--ui-color-accent-text)',
                      }}
                    >
                      {item.icon}
                    </span>
                    <Badge size="sm" tone="neutral">{item.badge}</Badge>
                  </Stack>
                  <Text weight="semibold" size="md">{item.title}</Text>
                  <Text size="sm" tone="secondary">{item.desc}</Text>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
}
