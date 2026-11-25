import * as React from 'react';
import {
  Alert, Badge, Banner, Button, Card, ChartIcon, CheckIcon, CopyIcon, ExternalLinkIcon, FolderIcon, Grid, Heading,
  HomeIcon, MoonIcon, Progress, SettingsIcon, Stack, SunIcon, Switch, Text, TextField, ThemeProvider, animeTheme,
  brutalistTheme, neonTheme, pixelTheme, sketchTheme, toast, type ColorScheme, type Theme,
} from '@yourorg/ui';

/**
 * MUI-style framed preview card for Storybook stories:
 * header bar with title + optional badge/actions, crisp dot-grid stage, and optional collapsible code snippet.
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
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="ui-demo-frame"
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {actions}
          {code ? (
            <>
              <Button size="sm" variant="ghost" tone="neutral" onClick={() => setShowCode((v) => !v)}>
                {showCode ? 'Hide code' : 'Code'}
              </Button>
              <Button size="sm" variant="outline" tone="neutral" startIcon={copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />} onClick={copy}>
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </>
          ) : null}
        </div>
      </div>

      <div
        style={{
          padding: flush ? 0 : 28,
          background: 'var(--ui-color-surface)',
        }}
      >
        {children}
      </div>

      {code && showCode ? (
        <pre
          style={{
            margin: 0,
            padding: '14px 18px',
            borderTop: '1px solid var(--ui-color-border)',
            background: 'var(--ui-color-surface-subtle)',
            fontFamily: 'var(--ui-font-mono)',
            fontSize: 12.5,
            lineHeight: 1.6,
            overflowX: 'auto',
          }}
        >
          <code>{code}</code>
        </pre>
      ) : null}
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
  const [selectedTheme, setSelectedTheme] = React.useState('default');
  const [scheme, setScheme] = React.useState<ColorScheme>('light');
  const [pkgMgr, setPkgMgr] = React.useState<'pnpm' | 'npm' | 'yarn'>('pnpm');
  const [copiedCmd, setCopiedCmd] = React.useState(false);
  const [progress, setProgress] = React.useState(68);
  const [notified, setNotified] = React.useState(true);

  const active = themeChoices.find((t) => t.id === selectedTheme) ?? themeChoices[0]!;

  const navigate = (href: string) => {
    if (typeof window !== 'undefined') {
      const target = window.top ?? window;
      target.location.href = `${target.location.pathname}${href}`;
    }
  };

  return (
    <ThemeProvider defaultColorScheme="light" style={{ background: 'transparent' }}>
      <Stack gap={8} style={{ marginBottom: 32 }}>
        {/* Hero section */}
        <div
          style={{
            position: 'relative',
            padding: '36px 32px',
            borderRadius: 18,
            border: '1px solid var(--ui-color-border)',
            background:
              'radial-gradient(640px 260px at 92% -10%, color-mix(in srgb, var(--ui-color-accent) 14%, transparent), transparent 65%), linear-gradient(180deg, var(--ui-color-surface) 0%, var(--ui-color-surface-subtle) 100%)',
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

        {/* Interactive live theme showcase (MUI-style framed demo) */}
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
                    <Progress label="CSS budget (13.5 / 16 KB)" value={progress} showValue />
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

        {/* Quick Install bar with package-manager tabs (MUI pattern) */}
        <div
          style={{
            border: '1px solid var(--ui-color-border)',
            borderRadius: 12,
            overflow: 'hidden',
            background: 'var(--ui-color-surface)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderBottom: '1px solid var(--ui-color-border)',
              background: 'var(--ui-color-surface-subtle)',
            }}
          >
            <Stack direction="row" gap={1}>
              {(['pnpm', 'npm', 'yarn'] as const).map((m) => (
                <Button
                  key={m}
                  size="sm"
                  variant={pkgMgr === m ? 'solid' : 'ghost'}
                  tone={pkgMgr === m ? 'accent' : 'neutral'}
                  onClick={() => setPkgMgr(m)}
                >
                  {m}
                </Button>
              ))}
            </Stack>
            <Button
              size="sm"
              variant="ghost"
              tone="neutral"
              startIcon={copiedCmd ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
              onClick={() => {
                void navigator.clipboard?.writeText(installCommands[pkgMgr]);
                setCopiedCmd(true);
                window.setTimeout(() => setCopiedCmd(false), 1500);
              }}
            >
              {copiedCmd ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <pre style={{ margin: 0, padding: '14px 18px', fontFamily: 'var(--ui-font-mono)', fontSize: 13, lineHeight: 1.65 }}>
            <code>{installCommands[pkgMgr]}</code>
          </pre>
        </div>

        {/* Start here card grid (MUI-style 3-column navigation cards) */}
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
