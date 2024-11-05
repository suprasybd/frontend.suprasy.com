import CategoriesPage from '@/pages/categories/CategoriesPage';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/store/$storeKey/categories')({
  component: () => <CategoriesPage />,
});
