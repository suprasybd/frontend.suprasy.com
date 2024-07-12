import { EasyBlockEditor } from '@customer/pages/viseditor/VisEditor';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/viseditor')({
  component: () => (
    <div className="w-full">
      <EasyBlockEditor />
    </div>
  ),
});
