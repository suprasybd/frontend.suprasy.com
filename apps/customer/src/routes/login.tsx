import { createFileRoute, redirect } from '@tanstack/react-router';
import Login from '../pages/login/Login';

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context && context.hasCookie) {
      throw redirect({ to: '/' });
    }
  },
  component: () => (
    <div className=" flex justify-center w-full items-center h-[100vh]">
      <Login />
    </div>
  ),
});
