import ForgotPassword from '@customer/pages/forgotpassword/ForgotPassword';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/forgotpassword')({
  component: () => (
    <div className=" flex justify-center w-full items-center h-[100vh] md:bg-gradient-to-tr from-cyan-100 to-sky-50">
      <ForgotPassword />
    </div>
  ),
});
