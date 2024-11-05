import ForgotPassword from '@/pages/forgotpassword/ForgotPassword';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/forgotpassword')({
  beforeLoad: ({ context }) => {
    if (context && context.hasCookie) {
      throw redirect({ to: '/' });
    }
  },
  component: () => (
    <div className=" flex justify-center w-full items-center h-[100vh] md:bg-gradient-to-tr from-cyan-100 to-sky-50">
      <ForgotPassword />
    </div>
  ),
});
