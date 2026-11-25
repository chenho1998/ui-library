import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button, Checkbox, Combobox, DatePicker, Grid, NumberField, Radio, RadioGroup, SearchIcon, Select, Slider, Stack,
  Switch, TextField, Textarea,
} from '@yourorg/ui';
import { DemoFrame } from './PreviewKit';

const meta = {
  title: 'Inputs & Actions/Text & Forms',
  parameters: { layout: 'padded', controls: { disable: true } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const cities = [
  'Kuala Lumpur', 'George Town', 'Johor Bahru', 'Ipoh', 'Shah Alam', 'Petaling Jaya', 'Kuching', 'Kota Kinabalu',
  'Melaka', 'Seremban', 'Kuantan', 'Alor Setar', 'Singapore', 'Bangkok', 'Jakarta', 'Manila', 'Ho Chi Minh City',
].map((c) => ({ value: c.toLowerCase().replace(/\s/g, '-'), label: c }));

export const TextFields: Story = {
  render: () => (
    <DemoFrame
      title="Text inputs & textarea"
      description="Labels, helper text, validation errors, adornments, sizes, disabled state and auto-resizing textarea."
      badge="9 variants"
      code={`<TextField label="Full name" placeholder="Aisha Rahman" required />
<TextField label="Price" startAdornment="RM" endAdornment="/month" inputMode="decimal" />
<Textarea label="Bio" maxLength={160} showCount autoResize />`}
    >
      <Grid minChildWidth="260px" gap={5}>
        <TextField label="Full name" placeholder="Aisha Rahman" required />
        <TextField label="Email" type="email" hint="We'll send a confirmation link." />
        <TextField label="Username" defaultValue="aisha!" error="Use letters, numbers and underscores only." />
        <TextField label="Search" hideLabel placeholder="Search projects" startAdornment={<SearchIcon size="sm" />} />
        <TextField label="Price" startAdornment="RM" endAdornment="/month" inputMode="decimal" />
        <TextField label="Disabled" disabled defaultValue="Read only value" />
        <TextField label="Small" size="sm" placeholder="Compact input" />
        <TextField label="Large" size="lg" placeholder="Large input" />
        <Textarea label="Bio" maxLength={160} showCount autoResize hint="Shown on your public profile." />
      </Grid>
    </DemoFrame>
  ),
};

export const Selection: Story = {
  render: function Render() {
    const [city, setCity] = React.useState<string | null>('kuala-lumpur');
    return (
      <DemoFrame
        title="Selection, date & numeric inputs"
        description="Select, grouped Select, searchable Combobox, DatePicker with disabled weekends, and formatted NumberField."
      >
        <Grid minChildWidth="260px" gap={5}>
          <Select label="Plan" defaultValue="pro" hint="You can change plans at any time.">
            <Select.Item value="free">Free</Select.Item>
            <Select.Item value="pro">Pro</Select.Item>
            <Select.Item value="team">Team</Select.Item>
            <Select.Separator />
            <Select.Item value="enterprise" disabled>Enterprise (contact sales)</Select.Item>
          </Select>
          <Select label="Timezone" placeholder="Choose a timezone">
            <Select.Group label="Asia">
              <Select.Item value="kl">Kuala Lumpur (UTC+8)</Select.Item>
              <Select.Item value="sg">Singapore (UTC+8)</Select.Item>
            </Select.Group>
            <Select.Group label="Europe">
              <Select.Item value="ldn">London (UTC+0)</Select.Item>
            </Select.Group>
          </Select>
          <Combobox label="City" options={cities} value={city} onValueChange={setCity} placeholder="Type to search" />
          <DatePicker label="Start date" hint="Weekends are unavailable." isDateDisabled={(d) => d.getDay() === 0 || d.getDay() === 6} />
          <NumberField label="Seats" defaultValue={5} min={1} max={500} />
          <NumberField label="Budget" defaultValue={2500} step={100} formatOptions={{ style: 'currency', currency: 'MYR' }} />
        </Grid>
      </DemoFrame>
    );
  },
};

export const ComboboxMultiple: Story = {
  name: 'Combobox: multiple',
  render: function Render() {
    const [picked, setPicked] = React.useState<string[]>(['kuala-lumpur', 'singapore']);
    return (
      <div style={{ maxWidth: 420 }}>
        <Combobox
          multiple
          label="Cities to visit"
          hint="Pick as many as you like. Backspace removes the last one."
          options={cities}
          value={picked}
          onValueChange={setPicked}
          placeholder="Type to search"
          name="cities"
        />
      </div>
    );
  },
};

// Pretend server: filters the cities after a short delay.
function searchCities(query: string): Promise<typeof cities> {
  const q = query.trim().toLowerCase();
  return new Promise((resolve) => setTimeout(() => resolve(cities.filter((c) => c.label.toLowerCase().includes(q))), 600));
}

// Loads options from the pretend server, ignoring responses that arrive out of order.
function useCitySearch() {
  const [options, setOptions] = React.useState<typeof cities>([]);
  const [loading, setLoading] = React.useState(true);
  const latest = React.useRef(0);
  const fetchCities = React.useCallback((query: string) => {
    const call = ++latest.current;
    void searchCities(query).then((result) => {
      if (call !== latest.current) return;
      setOptions(result);
      setLoading(false);
    });
  }, []);
  const load = React.useCallback(
    (query: string) => {
      setLoading(true);
      fetchCities(query);
    },
    [fetchCities],
  );
  React.useEffect(() => fetchCities(''), [fetchCities]);
  return { options, loading, onInputChange: load, filter: false as const };
}

export const ComboboxAsync: Story = {
  name: 'Combobox: async loading',
  render: function Render() {
    const single = useCitySearch();
    const several = useCitySearch();
    return (
      <div style={{ maxWidth: 420 }}>
        <Stack gap={6}>
          <Combobox label="City (server search)" placeholder="Type to search" {...single} />
          <Combobox multiple label="Cities (server search)" placeholder="Type to search" {...several} />
        </Stack>
      </div>
    );
  },
};

export const Choices: Story = {
  render: function Render() {
    const [items, setItems] = React.useState({ email: true, sms: false, push: true });
    const all = Object.values(items).every(Boolean);
    const some = Object.values(items).some(Boolean);
    return (
      <DemoFrame
        title="Checkboxes, radios, switches & sliders"
        description="Indeterminate checkboxes, radio groups, toggle switches, and single/range sliders."
      >
        <Grid minChildWidth="240px" gap={7}>
          <Stack gap={3}>
            <Checkbox
              label="All notifications"
              checked={all ? true : some ? 'indeterminate' : false}
              onCheckedChange={(v) => setItems({ email: !!v, sms: !!v, push: !!v })}
            />
            <Stack gap={2} style={{ paddingInlineStart: 28 }}>
              {(Object.keys(items) as Array<keyof typeof items>).map((k) => (
                <Checkbox key={k} label={k.toUpperCase()} checked={items[k]} onCheckedChange={(v) => setItems({ ...items, [k]: !!v })} />
              ))}
            </Stack>
            <Checkbox label="I agree to the terms" description="You can withdraw consent at any time." invalid />
          </Stack>
          <RadioGroup label="Billing cycle" defaultValue="monthly" hint="Yearly saves 20%.">
            <Radio value="monthly" label="Monthly" description="RM 49 per month" />
            <Radio value="yearly" label="Yearly" description="RM 470 per year" />
            <Radio value="lifetime" label="Lifetime" disabled />
          </RadioGroup>
          <Stack gap={4}>
            <Switch label="Two-factor authentication" description="Ask for a code when signing in." defaultChecked />
            <Switch label="Weekly digest" />
            <Switch label="Compact" size="sm" />
            <Slider label="Volume" showValue defaultValue={[40]} formatValue={(v) => `${v}%`} />
            <Slider label="Price range" showValue defaultValue={[20, 80]} thumbLabels={['Minimum price', 'Maximum price']} formatValue={(v) => `RM${v}`} />
          </Stack>
        </Grid>
      </DemoFrame>
    );
  },
};

export const SignUpForm: Story = {
  render: function Render() {
    const [submitted, setSubmitted] = React.useState(false);
    return (
      <DemoFrame
        title="Sign-up form"
        description="Submit with empty fields to inspect inline error validation and accessible error summaries."
        maxWidth={540}
      >
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          style={{ maxWidth: 420 }}
        >
          <Stack gap={4}>
            <TextField label="Work email" type="email" required error={submitted ? 'Enter your work email.' : undefined} />
            <TextField label="Password" type="password" required hint="At least 12 characters." />
            <Select label="Team size" defaultValue="1-10">
              <Select.Item value="1-10">1–10</Select.Item>
              <Select.Item value="11-50">11–50</Select.Item>
              <Select.Item value="51+">51+</Select.Item>
            </Select>
            <Checkbox label="Send me product updates" />
            <Button type="submit" fullWidth>Create account</Button>
          </Stack>
        </form>
      </DemoFrame>
    );
  },
};
