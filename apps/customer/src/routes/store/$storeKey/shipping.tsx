import { createFileRoute } from '@tanstack/react-router';
import Shipping from '../../../pages/shipping/Shipping';

export const Route = createFileRoute('/store/$storeKey/shipping')({
  component: () => <Shipping />,
});
