import { createFileRoute, redirect } from '@tanstack/react-router';
import GoogleCallback from '@/pages/auth/google/GoogleCallback';

export const Route = createFileRoute('/auth/google/callback')({
  beforeLoad: ({ context }) => {
    if (context && context.hasCookie) {
      throw redirect({ to: '/' });
    }
  },
  component: GoogleCallback,
});
