import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import StoreSidebar from '../components/StoreSidebar/StoreSidebar';
import StoreHeader from '../components/StoreHeader/StoreHeader';
import Cookies from 'js-cookie';

export const Route = createFileRoute('/store')({
  beforeLoad: async ({ context, params }) => {
    if (context && !context.hasCookie) {
      throw redirect({
        to: '/login',
      });
    }
    Cookies.set('storeKey', (params as { storeKey: string }).storeKey);
  },
  component: () => (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <StoreSidebar />
      <div className="flex flex-col">
        <StoreHeader />

        <Outlet />
      </div>
    </div>
    // <div className="flex gap-2 w-full max-h-[93vh] overflow-hidden">
    //   <StoreSidebar />
    //   <div className="overflow-auto w-full">
    //     <Outlet />
    //   </div>
    // </div>
  ),
});
