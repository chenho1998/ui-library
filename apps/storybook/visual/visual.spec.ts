import { expect, test } from '@playwright/test';

interface VisualCase {
  name: string;
  id: string;
  scheme?: 'light' | 'dark';
  theme?: 'default' | 'anime' | 'pixel' | 'brutalist' | 'sketch' | 'neon';
}

const cases: VisualCase[] = [
  { name: 'button-variants-light', id: 'components-actions-button--variants', scheme: 'light' },
  { name: 'button-variants-dark', id: 'components-actions-button--variants', scheme: 'dark' },
  { name: 'forms-textfields-light', id: 'components-forms-overview--text-fields', scheme: 'light' },
  { name: 'feedback-alerts-light', id: 'components-feedback-overview--alerts', scheme: 'light' },
  { name: 'banner-tones-light', id: 'components-feedback-banner--tones-and-variants', scheme: 'light' },
  { name: 'data-table-light', id: 'components-data-display-overview--table-example', scheme: 'light' },
  { name: 'datatable-playground-light', id: 'components-data-display-datatable--playground', scheme: 'light' },
  { name: 'carousel-playground-light', id: 'components-data-display-carousel--playground', scheme: 'light' },
  { name: 'color-picker-light', id: 'components-forms-colorpicker--live-theme-preview', scheme: 'light' },
  { name: 'resizable-nested-light', id: 'components-layout-resizable--nested-layout', scheme: 'light' },
  { name: 'icons-gallery-light', id: 'foundations-icons--gallery', scheme: 'light' },
  { name: 'themes-gallery-light', id: 'get-started-themes--gallery', scheme: 'light' },
  { name: 'themes-gallery-dark', id: 'get-started-themes--gallery', scheme: 'dark' },
  { name: 'app-shell-default', id: 'patterns-app-shell--dashboard', scheme: 'light', theme: 'default' },
  { name: 'app-shell-anime', id: 'patterns-app-shell--dashboard', scheme: 'light', theme: 'anime' },
  { name: 'app-shell-neon-dark', id: 'patterns-app-shell--dashboard', scheme: 'dark', theme: 'neon' },
];

for (const c of cases) {
  test(c.name, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('response', (res) => {
      if (res.status() >= 400) errors.push(`${res.status()} ${res.url()}`);
    });

    const globals = `scheme:${c.scheme ?? 'light'};theme:${c.theme ?? 'default'};font:theme`;
    await page.goto(`/iframe.html?id=${c.id}&viewMode=story&globals=${encodeURIComponent(globals)}`, {
      waitUntil: 'networkidle',
    });

    const root = page.locator('#storybook-root .ui-theme').first();
    await expect(root).toBeVisible();
    await page.evaluate(() => document.fonts.ready);

    expect(errors, `Console/page errors in ${c.name}`).toEqual([]);
    await expect(page).toHaveScreenshot(`${c.name}.png`, { fullPage: true });
  });
}
