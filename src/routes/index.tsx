import { createFileRoute, redirect } from '@tanstack/react-router';
import Home from '../pages/home/Home';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (!context.hasCookie) {
      throw redirect({ to: '/login' });
    }
  },
  component: () => <Home />,
});
