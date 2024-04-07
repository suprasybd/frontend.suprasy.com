import { createLazyFileRoute } from '@tanstack/react-router';
import Register from '@customer/pages/register/Register';

export const Route = createLazyFileRoute('/register')({
  component: () => (
    <div className=" flex justify-center w-full items-center h-[100vh]">
      {' '}
      <Register />
    </div>
  ),
});
