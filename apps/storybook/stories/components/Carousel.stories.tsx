import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Card, Carousel, Heading, Stack, Text } from '@yourorg/ui';

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
  { tag: 'Tokens', title: 'OKLCH palette generation', body: 'Every colour step and WCAG contrast check is verified at build time.' },
  { tag: 'Themes', title: 'One-switch expressive themes', body: 'Switch between default, anime, pixel, brutalist, sketch and neon in one prop.' },
  { tag: 'Accessibility', title: 'Keyboard and screen-reader ready', body: 'WAI-ARIA patterns, focus management and automated axe checks across all 50 components.' },
  { tag: 'Performance', title: 'Strict bundle-size budgets', body: 'Single-component imports stay tiny and CSS ships minified inside cascade layers.' },
];

export const Playground: Story = {
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <Carousel {...args}>
        {items.map((item) => (
          <Carousel.Slide key={item.title} style={{ padding: 4 }}>
            <Card variant="subtle" style={{ minHeight: 168 }}>
              <Stack gap={2}>
                <Badge tone="accent">{item.tag}</Badge>
                <Heading level={3} size="xl">{item.title}</Heading>
                <Text tone="secondary">{item.body}</Text>
              </Stack>
            </Card>
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  ),
};

export const MultiplePerView: Story = {
  args: { slidesPerView: 2, loop: false },
  render: (args) => (
    <div style={{ maxWidth: 760 }}>
      <Carousel {...args}>
        {items.map((item) => (
          <Carousel.Slide key={item.title} style={{ paddingInline: 6 }}>
            <Card variant="outline" style={{ height: '100%' }}>
              <Badge tone="info">{item.tag}</Badge>
              <Heading level={3} size="md">{item.title}</Heading>
              <Text size="sm" tone="secondary">{item.body}</Text>
            </Card>
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  ),
};
