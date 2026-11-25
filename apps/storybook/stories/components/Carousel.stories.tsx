import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Badge, Card, Carousel, ChartIcon, CheckIcon, Heading, SettingsIcon, Stack, SunIcon, Text,
} from '@yourorg/ui';
import { DemoFrame } from '../PreviewKit';

const meta = {
  title: 'Components/Data display/Carousel',
  component: Carousel,
  tags: ['new'],
  args: {
    'aria-label': 'Product highlights',
    loop: true,
    showControls: true,
    showIndicators: true,
    slidesPerView: 1,
  },
  argTypes: {
    loop: { control: 'boolean' },
    showControls: { control: 'boolean' },
    showIndicators: { control: 'boolean' },
    slidesPerView: { control: { type: 'number', min: 1, max: 3 } },
  },
  parameters: {
    docs: {
      description: {
        component: 'Accessible slideshow supporting Previous/Next buttons, dot indicators, arrow keys, swipe gestures and reduced-motion-aware auto-play.',
      },
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  {
    tag: 'Design tokens',
    metric: 'WCAG AA verified',
    title: 'OKLCH palette generation',
    body: 'Every colour step and light/dark contrast pair is computed and verified automatically at build time.',
    icon: <SunIcon size="sm" />,
  },
  {
    tag: 'Theming',
    metric: '6 expressive themes',
    title: 'One-switch expressive themes',
    body: 'Switch between Default, Anime, Pixel, Brutalist, Sketch and Neon with a single ThemeProvider prop.',
    icon: <SettingsIcon size="sm" />,
  },
  {
    tag: 'Accessibility',
    metric: '114 automated tests',
    title: 'Keyboard and screen-reader ready',
    body: 'WAI-ARIA patterns, focus management and automated axe checks across all 50 production components.',
    icon: <CheckIcon size="sm" />,
  },
  {
    tag: 'Performance',
    metric: '13.4 KB CSS gzipped',
    title: 'Strict bundle-size budgets',
    body: 'Single-component imports stay tiny and stylesheet bundles ship minified inside CSS cascade layers.',
    icon: <ChartIcon size="sm" />,
  },
];

export const Playground: Story = {
  render: (args) => (
    <DemoFrame
      title="Carousel"
      description="Swipe, click the unified footer controls, or use Left/Right arrow keys."
      badge="Keyboard & touch"
      maxWidth={720}
      code={`<Carousel aria-label="Product highlights" loop>
  {items.map((item) => (
    <Carousel.Slide key={item.title}>
      <Card variant="outline">...</Card>
    </Carousel.Slide>
  ))}
</Carousel>`}
    >
      <Carousel {...args}>
        {items.map((item, idx) => (
          <Carousel.Slide key={item.title} style={{ padding: 2 }}>
            <Card
              variant="outline"
              padding="lg"
              style={{
                minHeight: 204,
                background:
                  'radial-gradient(380px 160px at 100% 0%, color-mix(in srgb, var(--ui-color-accent) 14%, transparent), transparent 65%), var(--ui-color-surface)',
              }}
            >
              <Stack gap={4} style={{ height: '100%' }}>
                <Stack direction="row" justify="between" align="center" gap={2}>
                  <Stack direction="row" gap={2} align="center">
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
                    <Badge tone="accent">{item.tag}</Badge>
                  </Stack>
                  <Badge tone="neutral" variant="outline">{item.metric}</Badge>
                </Stack>
                <Stack gap={1}>
                  <Heading level={3} size="xl">{item.title}</Heading>
                  <Text tone="secondary">{item.body}</Text>
                </Stack>
                <Text size="xs" tone="secondary" style={{ marginTop: 'auto' }}>
                  Highlight 0{idx + 1} of 0{items.length}
                </Text>
              </Stack>
            </Card>
          </Carousel.Slide>
        ))}
      </Carousel>
    </DemoFrame>
  ),
};

export const MultiplePerView: Story = {
  args: { slidesPerView: 2, loop: false },
  render: (args) => (
    <DemoFrame
      title="Multiple slides per view"
      description="Set slidesPerView={2} or {3} for card rails and feature strips."
      maxWidth={840}
      code={`<Carousel aria-label="Product highlights" slidesPerView={2} loop={false}>
  ...
</Carousel>`}
    >
      <Carousel {...args}>
        {items.map((item) => (
          <Carousel.Slide key={item.title} style={{ paddingInline: 6 }}>
            <Card variant="outline" style={{ height: '100%' }}>
              <Stack gap={2}>
                <Stack direction="row" justify="between" align="center">
                  <Badge tone="info" size="sm">{item.tag}</Badge>
                  <Text size="xs" tone="secondary">{item.metric}</Text>
                </Stack>
                <Heading level={3} size="md">{item.title}</Heading>
                <Text size="sm" tone="secondary">{item.body}</Text>
              </Stack>
            </Card>
          </Carousel.Slide>
        ))}
      </Carousel>
    </DemoFrame>
  ),
};
