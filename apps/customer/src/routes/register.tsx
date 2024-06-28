import { createFileRoute, redirect } from '@tanstack/react-router';
import Register from '@customer/pages/register/Register';

export const Route = createFileRoute('/register')({
  beforeLoad: async ({ context, params }) => {
    if (context && context.hasCookie) {
      throw redirect({
        to: '/',
      });
    }
  },
  component: () => (
    <div className=" flex justify-center w-full items-center h-[100vh]">
      {' '}
      <Register />
    </div>
  ),
});
