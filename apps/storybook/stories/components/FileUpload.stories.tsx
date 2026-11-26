import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileUpload, toast } from '@yourorg/ui';
import { DemoFrame } from '../PreviewKit';

const meta = { title: 'Inputs & Actions/FileUpload', parameters: { controls: { disable: true } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const FileUploadExample: Story = {
  name: 'FileUpload',
  render: () => (
    <DemoFrame
      title="Drag-and-drop uploader"
      description="Validates file type, count and max size with instant accessible error feedback."
      badge="Max 3 files · 5 MB"
      code={`<FileUpload
  label="Attachments"
  accept="image/*,.pdf"
  multiple
  maxFiles={3}
  maxSize={5 * 1024 * 1024}
/>`}
    >
      <div style={{ maxWidth: 520 }}>
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
    </DemoFrame>
  ),
};
