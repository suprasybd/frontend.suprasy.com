import Categories from '@customer/pages/categories/Categories';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/store/$storeKey/categories')({
  component: () => <Categories />,
});
