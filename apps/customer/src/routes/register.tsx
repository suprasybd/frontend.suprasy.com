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
    <div className="overflow-auto flex justify-center w-full items-center h-[100vh] md:bg-gradient-to-tr from-cyan-100 to-sky-50">
      {' '}
      <Register />
    </div>
  ),
});
