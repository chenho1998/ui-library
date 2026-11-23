import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileUpload, toast } from '@yourorg/ui';

const meta = { title: 'Components/Forms/FileUpload', tags: ['new'] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const FileUploadExample: Story = {
  name: 'FileUpload',
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <FileUpload
        label="Attachments"
        hint="Images or PDF, up to 5 MB each, 3 files at most."
        accept="image/*,.pdf"
        multiple
        maxFiles={3}
        maxSize={5 * 1024 * 1024}
        onReject={(r) => toast.error(`${r.length} file(s) skipped`, { description: r.map((x) => `${x.file.name}: ${x.reason}`).join(', ') })}
      />
    </div>
  ),
};
