import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, ButtonGroup, IconButton, Link, MoreIcon, PlusIcon, Stack, Text, Tooltip, toast } from '@yourorg/ui';
import { DemoFrame } from './PreviewKit';

const meta = {
  title: 'Inputs & Actions/Button',
  component: Button,
  args: { children: 'Save changes', variant: 'solid', tone: 'accent', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'outline', 'ghost', 'link'] },
    tone: { control: 'inline-radio', options: ['accent', 'neutral', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { onClick: () => toast({ title: 'Clicked' }) },
  render: (args) => (
    <DemoFrame
      title="Button playground"
      description="Use the Controls panel below to toggle variant, tone, size, loading and disabled states."
      maxWidth={680}
    >
      <Button {...args} />
    </DemoFrame>
  ),
};

const variants = ['solid', 'outline', 'ghost', 'link'] as const;
const tones = ['accent', 'neutral', 'danger'] as const;

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DemoFrame
      title="Variants & tones"
      description="Four visual weights across accent, neutral and danger semantic tones."
      badge="12 combinations"
      code={`<Button variant="solid" tone="accent">Solid</Button>
<Button variant="outline" tone="neutral">Outline</Button>
<Button variant="ghost" tone="danger">Ghost</Button>
<Button variant="link" tone="accent">Link</Button>`}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '88px repeat(4, minmax(110px, 1fr))',
          gap: '16px 12px',
          alignItems: 'center',
        }}
      >
        <span />
        {variants.map((variant) => (
          <Text
            key={variant}
            size="xs"
            weight="semibold"
            tone="secondary"
            style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}
          >
            {variant}
          </Text>
        ))}
        {tones.map((tone) => (
          <div key={tone} style={{ display: 'contents' }}>
            <Text size="sm" weight="medium" tone="secondary" style={{ textTransform: 'capitalize' }}>
              {tone}
            </Text>
            {variants.map((variant) => (
              <div key={variant}>
                <Button tone={tone} variant={variant}>
                  {variant === 'link' ? `${tone} link` : `${variant}`}
                </Button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </DemoFrame>
  ),
};

export const SizesAndStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DemoFrame
      title="Sizes & interactive states"
      description="Small, medium and large heights plus icon adornments, loading spinner and disabled state."
      code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button startIcon={<PlusIcon size="sm" />}>New project</Button>
<Button loading>Saving</Button>
<Button disabled>Disabled</Button>`}
    >
      <Stack gap={4}>
        <Stack direction="row" gap={3} align="center" wrap>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Stack>
        <Stack direction="row" gap={3} align="center" wrap>
          <Button startIcon={<PlusIcon size="sm" />}>New project</Button>
          <Button loading>Saving</Button>
          <Button disabled>Disabled</Button>
        </Stack>
      </Stack>
    </DemoFrame>
  ),
};

export const IconButtons: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DemoFrame
      title="Icon buttons"
      description="Square icon-only actions — always pair with aria-label and an optional Tooltip."
      maxWidth={680}
      code={`<Tooltip content="More actions">
  <IconButton aria-label="More actions"><MoreIcon /></IconButton>
</Tooltip>
<IconButton aria-label="Add" variant="solid" tone="accent"><PlusIcon /></IconButton>
<IconButton aria-label="Add" variant="outline" size="sm"><PlusIcon size="sm" /></IconButton>`}
    >
      <Stack direction="row" gap={3} align="center">
        <Tooltip content="More actions">
          <IconButton aria-label="More actions"><MoreIcon /></IconButton>
        </Tooltip>
        <IconButton aria-label="Add" variant="solid" tone="accent"><PlusIcon /></IconButton>
        <IconButton aria-label="Add" variant="outline" size="sm"><PlusIcon size="sm" /></IconButton>
      </Stack>
    </DemoFrame>
  ),
};

export const Groups: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DemoFrame
      title="Button groups"
      description="Attached segmented toolbars and paired action bars."
      maxWidth={680}
      code={`<ButtonGroup aria-label="Text alignment" attached>
  <Button variant="outline" tone="neutral">Left</Button>
  <Button variant="outline" tone="neutral">Center</Button>
  <Button variant="outline" tone="neutral">Right</Button>
</ButtonGroup>`}
    >
      <Stack gap={4}>
        <ButtonGroup aria-label="Text alignment" attached>
          <Button variant="outline" tone="neutral">Left</Button>
          <Button variant="outline" tone="neutral">Center</Button>
          <Button variant="outline" tone="neutral">Right</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline" tone="neutral">Cancel</Button>
          <Button>Continue</Button>
        </ButtonGroup>
      </Stack>
    </DemoFrame>
  ),
};

export const Links: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DemoFrame
      title="Links"
      description="Inline prose links, standalone navigation links and external links."
      maxWidth={680}
      code={`<p>Read the <Link href="#">pricing guide</Link> before you upgrade.</p>
<Link href="#" variant="standalone">View all invoices</Link>
<Link href="https://example.com" external>External link</Link>`}
    >
      <Stack gap={2}>
        <p style={{ margin: 0 }}>Read the <Link href="#">pricing guide</Link> before you upgrade.</p>
        <Link href="#" variant="standalone">View all invoices</Link>
        <Link href="https://example.com" external>External link</Link>
      </Stack>
    </DemoFrame>
  ),
};
