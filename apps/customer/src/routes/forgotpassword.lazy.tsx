import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/forgotpassword')({
  component: () => <div>Hello /forgotpassword!</div>,
});
