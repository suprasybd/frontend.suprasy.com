import Turnstile from '@/pages/turnstile/Turnstile';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/store/$storeKey/turnstile')({
  component: () => <Turnstile />,
});
