import * as React from 'react';
import { render } from '@testing-library/react';
import axe from 'axe-core';
import { ThemeProvider } from '../src';

export function renderUI(ui: React.ReactElement) {
  return render(<ThemeProvider defaultColorScheme="light">{ui}</ThemeProvider>);
}

/** Runs axe on a container; colour contrast is checked separately by the token build. */
export async function axeViolations(container: Element) {
  const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } });
  return results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
}
