import * as React from 'react';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { create } from 'storybook/theming';
import { Badge, ChevronLeftIcon, ChevronRightIcon, Stack, Text, ThemeProvider, type ColorScheme, type Theme } from '@yourorg/ui';
import { CURRENT_VERSION, getAdjacentPages } from './componentRegistry';
import { resolveStorybookTheme } from './themeConfig';

const docsLightTheme = create({
  base: 'light',
  colorPrimary: '#2c5df5',
  colorSecondary: '#2c5df5',
  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#e2e6ee',
  textColor: '#17191d',
  textMutedColor: '#5b6270',
  barBg: '#ffffff',
  fontBase: "Inter, -apple-system, 'Segoe UI', Roboto, sans-serif",
  fontCode: "'JetBrains Mono', ui-monospace, Menlo, monospace",
});

const docsDarkTheme = create({
  base: 'dark',
  colorPrimary: '#4c7dfe',
  colorSecondary: '#769fff',
  appBg: '#090b10',
  appContentBg: '#10131c',
  appPreviewBg: '#090b10',
  appBorderColor: '#232a3b',
  textColor: '#f1f5f9',
  textMutedColor: '#9fb0c7',
  barBg: '#10131c',
  inputBg: '#161b26',
  inputBorder: '#2a3347',
  inputTextColor: '#f1f5f9',
  fontBase: "Inter, -apple-system, 'Segoe UI', Roboto, sans-serif",
  fontCode: "'JetBrains Mono', ui-monospace, Menlo, monospace",
});

export interface DocsGlobalsState {
  scheme: 'light' | 'dark';
  themeId: string;
  font: string;
  theme: Theme | undefined;
}

export const DocsGlobalsContext = React.createContext<DocsGlobalsState>({
  scheme: 'light',
  themeId: 'default',
  font: 'theme',
  theme: undefined,
});

export function useDocsGlobals(): DocsGlobalsState {
  return React.useContext(DocsGlobalsContext);
}

export function useDocsScheme(): 'light' | 'dark' {
  return React.useContext(DocsGlobalsContext).scheme;
}

function resolveColorScheme(raw: unknown): 'light' | 'dark' {
  if (raw === 'dark') return 'dark';
  if (raw === 'system' && typeof window !== 'undefined') {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

export function navigateTop(href: string) {
  if (typeof window !== 'undefined') {
    const target = window.top ?? window;
    target.location.href = `${target.location.pathname}${href}`;
  }
}

/**
 * Custom Storybook DocsContainer that listens to the top Scheme / Theme / Font toolbar
 * and seamlessly syncs the ENTIRE Docs page — wrapper, headings, tables, code blocks,
 * Controls, TOC, Design Token swatches, and custom React blocks — without reload.
 */
export function ThemedDocsContainer({ children, context, ...props }: React.PropsWithChildren<DocsContainerProps>) {
  const initialGlobals =
    (context as unknown as { store?: { userGlobals?: { globals?: Record<string, unknown> } } }).store?.userGlobals
      ?.globals ?? {};

  const [scheme, setScheme] = React.useState<'light' | 'dark'>(() => resolveColorScheme(initialGlobals.scheme));
  const [themeId, setThemeId] = React.useState<string>(() => String(initialGlobals.theme ?? 'default'));
  const [font, setFont] = React.useState<string>(() => String(initialGlobals.font ?? 'theme'));

  React.useEffect(() => {
    const channel = context.channel;
    const onGlobals = (payload: { globals?: Record<string, unknown> }) => {
      const g = payload?.globals;
      if (!g) return;
      if ('scheme' in g) setScheme(resolveColorScheme(g.scheme));
      if ('theme' in g) setThemeId(String(g.theme ?? 'default'));
      if ('font' in g) setFont(String(g.font ?? 'theme'));
    };
    channel?.on('globalsUpdated', onGlobals);
    channel?.on('setGlobals', onGlobals);
    return () => {
      channel?.off('globalsUpdated', onGlobals);
      channel?.off('setGlobals', onGlobals);
    };
  }, [context.channel]);

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.uiDocsScheme = scheme;
    }
  }, [scheme]);

  const docsGlobals = React.useMemo<DocsGlobalsState>(
    () => ({ scheme, themeId, font, theme: resolveStorybookTheme(themeId, font) }),
    [scheme, themeId, font],
  );

  return (
    <DocsGlobalsContext.Provider value={docsGlobals}>
      <DocsContainer {...props} context={context} theme={scheme === 'dark' ? docsDarkTheme : docsLightTheme}>
        {children}
      </DocsContainer>
    </DocsGlobalsContext.Provider>
  );
}

/** MUI-style editorial hero banner for standalone MDX guides (Usage guidelines, Migration guide). */
export function GuideHeader({
  eyebrow = 'Getting Started',
  title,
  description,
  badge = CURRENT_VERSION,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  badge?: string;
}) {
  const scheme = useDocsScheme();
  return (
    <ThemeProvider colorScheme={scheme as ColorScheme} style={{ background: 'transparent' }}>
      <header
        style={{
          paddingBottom: 22,
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
              {eyebrow}
            </span>
            <Badge size="sm" tone="accent" variant="subtle">{badge}</Badge>
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
              {title}
            </h1>
            <Text size="md" tone="secondary" style={{ margin: 0, maxWidth: 720, lineHeight: 1.6 }}>
              {description}
            </Text>
          </div>
        </Stack>
      </header>
    </ThemeProvider>
  );
}

/** MUI-style Previous / Next page navigation cards rendered at the footer of Docs & Component pages. */
export function DocFooterNav({ currentTitle }: { currentTitle: string }) {
  const scheme = useDocsScheme();
  const { prev, next } = getAdjacentPages(currentTitle);
  if (!prev && !next) return null;

  return (
    <ThemeProvider colorScheme={scheme as ColorScheme} style={{ background: 'transparent', marginTop: 48 }}>
      <nav
        aria-label="Page pagination"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14,
          paddingTop: 24,
          borderTop: '1px solid var(--ui-color-border)',
        }}
      >
        {prev ? (
          <a
            href={prev.href}
            target="_top"
            className="ui-doc-pager-card"
            onClick={(e) => {
              e.preventDefault();
              navigateTop(prev.href);
            }}
          >
            <span className="ui-doc-pager-eyebrow">
              <ChevronLeftIcon size={14} /> Previous · {prev.category}
            </span>
            <span className="ui-doc-pager-title">{prev.label}</span>
          </a>
        ) : (
          <div />
        )}
        {next ? (
          <a
            href={next.href}
            target="_top"
            className="ui-doc-pager-card ui-doc-pager-card--next"
            onClick={(e) => {
              e.preventDefault();
              navigateTop(next.href);
            }}
          >
            <span className="ui-doc-pager-eyebrow">
              Next · {next.category} <ChevronRightIcon size={14} />
            </span>
            <span className="ui-doc-pager-title">{next.label}</span>
          </a>
        ) : (
          <div />
        )}
      </nav>
    </ThemeProvider>
  );
}
