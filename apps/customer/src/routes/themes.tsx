import AdminThemes from '@customer/pages/admin-themes/AdminThemes';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/themes')({
  component: () => (
    <div>
      <AdminThemes />
    </div>
  ),
});
