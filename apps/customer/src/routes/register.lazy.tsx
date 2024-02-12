import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/register')({
  component: () => <div>Hello /register!</div>,
});
