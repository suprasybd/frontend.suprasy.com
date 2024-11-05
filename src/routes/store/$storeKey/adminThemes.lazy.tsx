import AdminThemes from '@/pages/admin-themes/AdminThemes';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/store/$storeKey/adminThemes')({
  component: () => (
    <div>
      <AdminThemes />
    </div>
  ),
});
