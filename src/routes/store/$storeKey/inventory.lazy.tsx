import { createLazyFileRoute } from '@tanstack/react-router';
import Inventory from '../../../pages/inventory/Inventory';

export const Route = createLazyFileRoute('/store/$storeKey/inventory')({
  component: () => <Inventory />,
});
