import { expect, test } from '@playwright/test';

interface VisualCase {
  name: string;
  id: string;
  scheme?: 'light' | 'dark';
  theme?: 'default' | 'anime' | 'pixel' | 'brutalist' | 'sketch' | 'neon';
}

const cases: VisualCase[] = [
  { name: 'button-variants-light', id: 'inputs-actions-button--variants', scheme: 'light' },
  { name: 'button-variants-dark', id: 'inputs-actions-button--variants', scheme: 'dark' },
  { name: 'forms-textfields-light', id: 'inputs-actions-text-forms--text-fields', scheme: 'light' },
  { name: 'feedback-alerts-light', id: 'feedback-alerts-toasts--alerts', scheme: 'light' },
  { name: 'banner-tones-light', id: 'feedback-banner--tones-and-variants', scheme: 'light' },
  { name: 'data-table-light', id: 'data-display-tables-cards--table-example', scheme: 'light' },
  { name: 'datatable-playground-light', id: 'data-display-datatable--playground', scheme: 'light' },
  { name: 'carousel-playground-light', id: 'data-display-carousel--playground', scheme: 'light' },
  { name: 'color-picker-light', id: 'inputs-actions-colorpicker--live-theme-preview', scheme: 'light' },
  { name: 'resizable-nested-light', id: 'navigation-layout-resizable--nested-layout', scheme: 'light' },
  { name: 'icons-gallery-light', id: 'foundations-icons--gallery', scheme: 'light' },
  { name: 'themes-gallery-light', id: 'getting-started-themes--gallery', scheme: 'light' },
  { name: 'themes-gallery-dark', id: 'getting-started-themes--gallery', scheme: 'dark' },
  { name: 'app-shell-default', id: 'templates-app-shell--dashboard', scheme: 'light', theme: 'default' },
  { name: 'app-shell-anime', id: 'templates-app-shell--dashboard', scheme: 'light', theme: 'anime' },
  { name: 'app-shell-neon-dark', id: 'templates-app-shell--dashboard', scheme: 'dark', theme: 'neon' },
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
