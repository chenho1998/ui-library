---
'@yourorg/ui': minor
'@yourorg/tokens': minor
---

- `animeTheme`: an opt-in theme that restyles every component (ink outlines, cel-shaded buttons, offset shadows,
  sparkles, screentone, wavy links) with one `<ThemeProvider theme={animeTheme}>` switch.
- `withFont()` and `FONT_STACKS` (OpenDyslexic, M PLUS Rounded 1c, Mochiy Pop One); headings and titles now use
  `--ui-font-display` / `--ui-font-display-weight`, which fall back to the body font.
- Combobox: `multiple` (removable tags, Backspace removes the last) and `loading` for server-side search, with a
  screen-reader result count. New locale strings `results` and `removeItem`.
- Toasts swipe towards their screen edge with drag feedback, snap back and a slide-out exit; works with mouse too.
- Tokens: amber warning colours are more yellow so warning and danger no longer look alike; dark-mode tints are less
  saturated.
- The system colour scheme is read with `useSyncExternalStore`; DatePicker's trigger no longer carries ARIA attributes
  that buttons don't support.
