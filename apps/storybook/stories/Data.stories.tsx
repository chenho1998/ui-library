import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Accordion, Avatar, Badge, Button, Card, EmptyState, Grid, PlusIcon, Stack, Table, Tag, Text, type TableSort,
} from '@yourorg/ui';

const meta = { title: 'Data display/Overview' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

type Customer = { id: string; name: string; plan: string; seats: number; status: 'Active' | 'Trial' | 'Overdue'; mrr: number };
const customers: Customer[] = [
  { id: 'c1', name: 'Acme Sdn Bhd', plan: 'Team', seats: 42, status: 'Active', mrr: 2058 },
  { id: 'c2', name: 'Globex', plan: 'Pro', seats: 8, status: 'Trial', mrr: 0 },
  { id: 'c3', name: 'Initech', plan: 'Team', seats: 19, status: 'Overdue', mrr: 931 },
  { id: 'c4', name: 'Umbrella Labs', plan: 'Enterprise', seats: 230, status: 'Active', mrr: 11270 },
  { id: 'c5', name: 'Hooli', plan: 'Pro', seats: 5, status: 'Active', mrr: 245 },
];
const tone = { Active: 'success', Trial: 'info', Overdue: 'danger' } as const;
const money = new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', maximumFractionDigits: 0 });

export const TableExample: Story = {
  name: 'Table',
  render: function Render() {
    const [sort, setSort] = React.useState<TableSort | null>({ key: 'mrr', direction: 'desc' });
    const [selection, setSelection] = React.useState<Set<string>>(new Set());
    const [loading, setLoading] = React.useState(false);
    const rows = React.useMemo(() => {
      if (!sort) return customers;
      const k = sort.key as keyof Customer;
      return [...customers].sort((a, b) => (a[k] > b[k] ? 1 : -1) * (sort.direction === 'asc' ? 1 : -1));
    }, [sort]);
    return (
      <Stack gap={3}>
        <Stack direction="row" gap={2} align="center">
          <Text size="sm" tone="secondary">{selection.size} selected</Text>
          <Button size="sm" variant="outline" tone="neutral" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1200); }}>Reload</Button>
        </Stack>
        <Table
          caption="Customers"
          columns={[
            { key: 'name', header: 'Customer', sortable: true, cell: (r) => <Stack direction="row" gap={2} align="center"><Avatar name={r.name} size="xs" />{r.name}</Stack> },
            { key: 'plan', header: 'Plan', sortable: true },
            { key: 'status', header: 'Status', cell: (r) => <Badge tone={tone[r.status]}>{r.status}</Badge> },
            { key: 'seats', header: 'Seats', sortable: true, align: 'end' },
            { key: 'mrr', header: 'MRR', sortable: true, align: 'end', cell: (r) => money.format(r.mrr) },
          ]}
          data={rows}
          rowKey={(r) => r.id}
          rowLabel={(r) => r.name}
          sort={sort}
          onSortChange={setSort}
          selection={selection}
          onSelectionChange={setSelection}
          loading={loading}
        />
        <Table
          caption="Invoices"
          density="compact"
          columns={[{ key: 'id', header: 'Invoice' }, { key: 'total', header: 'Total', align: 'end' }]}
          data={[] as { id: string; total: string }[]}
          rowKey={(r) => r.id}
          emptyState={<EmptyState title="No invoices yet" description="Invoices appear here after your first billing cycle." />}
        />
      </Stack>
    );
  },
};

export const Cards: Story = {
  render: () => (
    <Grid minChildWidth="240px" gap={4} style={{ maxWidth: 900 }}>
      <Card>
        <Card.Header>
          <Card.Title>Website redesign</Card.Title>
          <Card.Description>Due 12 Dec · 8 open tasks</Card.Description>
        </Card.Header>
        <Stack direction="row" gap={1} wrap><Tag>Design</Tag><Tag tone="accent">Q4</Tag></Stack>
        <Card.Footer>
          <Stack direction="row" gap={1}>
            <Avatar name="Aisha Rahman" size="sm" />
            <Avatar name="Wei Ling Tan" size="sm" />
            <Avatar name="Ravi Kumar" size="sm" />
          </Stack>
          <Badge tone="warning" style={{ marginInlineStart: 'auto' }}>At risk</Badge>
        </Card.Footer>
      </Card>
      <Card variant="elevated">
        <Card.Header>
          <Card.Title>Monthly revenue</Card.Title>
          <Card.Description>November 2026</Card.Description>
        </Card.Header>
        <Text size="3xl" weight="semibold">RM 14,504</Text>
        <Badge tone="success">+12.4% vs October</Badge>
      </Card>
      <Card variant="subtle" padding="sm">
        <EmptyState title="No reports" description="Create your first report to see it here." action={<Button size="sm" startIcon={<PlusIcon size="sm" />}>New report</Button>} />
      </Card>
    </Grid>
  ),
};

export const BadgesTagsAvatars: Story = {
  render: function Render() {
    const [tags, setTags] = React.useState(['React', 'TypeScript', 'Design systems']);
    return (
      <Stack gap={5}>
        <Stack direction="row" gap={2} wrap>
          {(['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const).map((t) => <Badge key={t} tone={t}>{t}</Badge>)}
        </Stack>
        <Stack direction="row" gap={2} wrap>
          {(['neutral', 'accent', 'success', 'danger'] as const).map((t) => <Badge key={t} tone={t} variant="solid">{t}</Badge>)}
          <Badge tone="accent" variant="outline">outline</Badge>
        </Stack>
        <Stack direction="row" gap={2} wrap>
          {tags.map((t) => <Tag key={t} onRemove={() => setTags(tags.filter((x) => x !== t))}>{t}</Tag>)}
        </Stack>
        <Stack direction="row" gap={3} align="center">
          <Avatar name="Aisha Rahman" size="xs" />
          <Avatar name="Aisha Rahman" size="sm" />
          <Avatar name="Aisha Rahman" />
          <Avatar name="Aisha Rahman" size="lg" />
          <Avatar name="Acme" shape="square" />
        </Stack>
      </Stack>
    );
  },
};

export const AccordionExample: Story = {
  name: 'Accordion',
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <Accordion type="single" collapsible defaultValue="a">
        <Accordion.Item value="a" title="Can I change plans later?">Yes. Changes take effect on your next billing date.</Accordion.Item>
        <Accordion.Item value="b" title="Do you offer refunds?">Within 14 days of purchase, no questions asked.</Accordion.Item>
        <Accordion.Item value="c" title="Is my data encrypted?">Yes, at rest and in transit.</Accordion.Item>
      </Accordion>
    </div>
  ),
};
