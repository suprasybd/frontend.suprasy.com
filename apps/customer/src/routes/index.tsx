import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (!context.hasCookie) {
      throw redirect({ to: '/login' });
    }
  },
  component: () => <div>Hello /!</div>,
});
