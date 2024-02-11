import { createLazyFileRoute } from '@tanstack/react-router';

import Login from '../pages/login/Login';

export const Route = createLazyFileRoute('/login')({
  component: () => (
    <div className=" flex justify-center w-full items-center h-[100vh]">
      <Login />
    </div>
  ),
});
