import { createFileRoute } from '@tanstack/react-router';
import Test from '../pages/test/Test';

export const Route = createFileRoute('/test')({
  component: () => <Test />,
});
