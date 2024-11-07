import { createFileRoute } from '@tanstack/react-router';
import Subscription from '../../../pages/subscription/Subscription';

export const Route = createFileRoute('/store/$storeKey/subscription')({
  component: () => <Subscription />,
});
