import * as React from 'react';
import { addons, types, useGlobals, useStorybookApi } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const shared = {
  brandTitle: 'UI Library',
  brandUrl: 'https://github.com/chenho1998/ui-library',
  brandTarget: '_blank',
  appBorderRadius: 10,
  inputBorderRadius: 8,
  fontBase: "Inter, -apple-system, 'Segoe UI', Roboto, sans-serif",
  fontCode: "'JetBrains Mono', ui-monospace, Menlo, monospace",
};

const lightTheme = create({
  ...shared,
  base: 'light',
  brandImage: 'logo.svg',
  colorPrimary: '#2c5df5',
  colorSecondary: '#2c5df5',
  appBg: '#f8fafc',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#e2e6ee',
  textColor: '#17191d',
  textMutedColor: '#5b6472',
  barBg: '#ffffff',
  barTextColor: '#5b6472',
  barSelectedColor: '#2c5df5',
  barHoverColor: '#2c5df5',
  inputBg: '#ffffff',
  inputBorder: '#d8dee9',
  inputTextColor: '#17191d',
});

const darkTheme = create({
  ...shared,
  base: 'dark',
  brandImage: 'logo-dark.svg',
  colorPrimary: '#4c7dfe',
  colorSecondary: '#769fff',
  appBg: '#090b10',
  appContentBg: '#10131c',
  appPreviewBg: '#090b10',
  appBorderColor: '#232a3b',
  textColor: '#f1f5f9',
  textMutedColor: '#9fb0c7',
  barBg: '#0d1017',
  barTextColor: '#9fb0c7',
  barSelectedColor: '#769fff',
  barHoverColor: '#a6c2fe',
  inputBg: '#161b26',
  inputBorder: '#2a3347',
  inputTextColor: '#f1f5f9',
});

const THEME_SWATCHES = [
  { id: 'default', label: 'Default', dot: '#2c5df5' },
  { id: 'violet', label: 'Violet', dot: '#7c3aed' },
  { id: 'teal', label: 'Teal', dot: '#0d9488' },
  { id: 'anime', label: 'Anime', dot: '#ff2e88' },
  { id: 'pixel', label: 'Pixel', dot: '#3d5afe' },
  { id: 'brutalist', label: 'Brutalist', dot: '#eab308' },
  { id: 'sketch', label: 'Sketch', dot: '#2457c5' },
  { id: 'neon', label: 'Neon', dot: '#d946ef' },
] as const;

function SunSvg() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonSvg() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function resolveScheme(raw: unknown): 'light' | 'dark' {
  if (raw === 'dark') return 'dark';
  if (raw === 'system' && typeof window !== 'undefined') {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

/**
 * Custom inline toolbar (zero dropdowns):
 * - Direct Light / Dark segmented toggle (syncs BOTH Manager shell and Docs/Canvas iframe)
 * - Direct inline Theme colour-dot pills (1 click switches all 8 themes)
 * - Direct 1-click OpenDyslexic font toggle
 */
function InlinePreviewToolbar() {
  const [globals, updateGlobals] = useGlobals();
  const api = useStorybookApi();

  const scheme = resolveScheme(globals.scheme);
  const currentTheme = (globals.theme as string) || 'default';
  const isDyslexic = globals.font === 'openDyslexic';

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.uiManagerScheme = scheme;
    }
    api.setOptions({ theme: scheme === 'dark' ? darkTheme : lightTheme });
  }, [scheme, api]);

  return (
    <div className="ui-tb-root" role="group" aria-label="Preview controls">
      {/* Direct Light / Dark segmented switch */}
      <div className="ui-tb-segment" role="group" aria-label="Colour scheme">
        <button
          type="button"
          className={`ui-tb-seg-btn${scheme === 'light' ? ' is-active' : ''}`}
          aria-pressed={scheme === 'light'}
          onClick={() => updateGlobals({ scheme: 'light' })}
          title="Light mode"
        >
          <SunSvg />
          <span>Light</span>
        </button>
        <button
          type="button"
          className={`ui-tb-seg-btn${scheme === 'dark' ? ' is-active' : ''}`}
          aria-pressed={scheme === 'dark'}
          onClick={() => updateGlobals({ scheme: 'dark' })}
          title="Dark mode"
        >
          <MoonSvg />
          <span>Dark</span>
        </button>
      </div>

      <span className="ui-tb-sep" aria-hidden="true" />

      {/* Direct inline theme swatch bar */}
      <div className="ui-tb-themes" role="group" aria-label="Theme">
        {THEME_SWATCHES.map((t) => {
          const active = currentTheme === t.id;
          return (
            <button
              key={t.id}
              type="button"
              className={`ui-tb-theme-btn${active ? ' is-active' : ''}`}
              aria-pressed={active}
              onClick={() => updateGlobals({ theme: t.id })}
              title={`Switch to ${t.label} theme`}
            >
              <span className="ui-tb-dot" style={{ background: t.dot }} aria-hidden="true" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <span className="ui-tb-sep" aria-hidden="true" />

      {/* Direct 1-click OpenDyslexic toggle */}
      <button
        type="button"
        className={`ui-tb-font-btn${isDyslexic ? ' is-active' : ''}`}
        aria-pressed={isDyslexic}
        onClick={() => updateGlobals({ font: isDyslexic ? 'theme' : 'openDyslexic' })}
        title="Toggle OpenDyslexic font everywhere"
      >
        <span className="ui-tb-aa" aria-hidden="true">Aa</span>
        <span>Dyslexic</span>
      </button>
    </div>
  );
}

addons.register('ui-library/toolbar', () => {
  addons.add('ui-library/toolbar/controls', {
    title: 'Preview controls',
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
    render: () => <InlinePreviewToolbar />,
  });
});

addons.setConfig({
  theme: lightTheme,
  showPanel: false,
  toolbar: {
    zoom: { hidden: true },
    eject: { hidden: false },
    copy: { hidden: true },
    fullscreen: { hidden: false },
    'storybook/background': { hidden: true },
    'storybook/outline': { hidden: true },
    'storybook/measure': { hidden: true },
  },
  sidebar: {
    showRoots: true,
    renderLabel: (item) => {
      const tags = (item as { tags?: string[] }).tags;
      const isLeaf = item.type === 'docs' || item.type === 'story' || item.type === 'component';
      return isLeaf && tags?.includes('new') ? (
        <span className="ui-sb-label">
          <span className="ui-sb-name">{item.name}</span>
          <span className="ui-sb-badge">v0.3</span>
        </span>
      ) : (
        item.name
      );
    },
  },
});
