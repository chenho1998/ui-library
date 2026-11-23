import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, ButtonGroup, IconButton, Link, PlusIcon, MoreIcon, Stack, Tooltip, toast } from '@yourorg/ui';

const meta = {
  title: 'Actions/Button',
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

export const Playground: Story = { args: { onClick: () => toast({ title: 'Clicked' }) } };

export const Variants: Story = {
  render: () => (
    <Stack gap={4}>
      {(['accent', 'neutral', 'danger'] as const).map((tone) => (
        <Stack key={tone} direction="row" gap={3} align="center">
          {(['solid', 'outline', 'ghost', 'link'] as const).map((variant) => (
            <Button key={variant} tone={tone} variant={variant}>
              {variant} {tone}
            </Button>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const SizesAndStates: Story = {
  render: () => (
    <Stack direction="row" gap={3} align="center" wrap>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button startIcon={<PlusIcon size="sm" />}>New project</Button>
      <Button loading>Saving</Button>
      <Button disabled>Disabled</Button>
    </Stack>
  ),
};

export const IconButtons: Story = {
  render: () => (
    <Stack direction="row" gap={2}>
      <Tooltip content="More actions">
        <IconButton aria-label="More actions"><MoreIcon /></IconButton>
      </Tooltip>
      <IconButton aria-label="Add" variant="solid" tone="accent"><PlusIcon /></IconButton>
      <IconButton aria-label="Add" variant="outline" size="sm"><PlusIcon size="sm" /></IconButton>
    </Stack>
  ),
};

export const Groups: Story = {
  render: () => (
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
  ),
};

export const Links: Story = {
  render: () => (
    <Stack gap={2}>
      <p>Read the <Link href="#">pricing guide</Link> before you upgrade.</p>
      <Link href="#" variant="standalone">View all invoices</Link>
      <Link href="https://example.com" external>External link</Link>
    </Stack>
  ),
};
