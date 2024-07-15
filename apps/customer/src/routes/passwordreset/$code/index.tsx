import PasswordReset from '@customer/pages/passwordreset/PasswordReset';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/passwordreset/$code/')({
  component: () => (
    <div className=" flex justify-center w-full items-center h-[100vh] md:bg-gradient-to-tr from-cyan-100 to-sky-50">
      <PasswordReset />
    </div>
  ),
});
