import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import StoreSidebar from '../components/StoreSidebar/StoreSidebar';
import StoreHeader from '../components/StoreHeader/StoreHeader';
import Cookies from 'js-cookie';
import Modals from '@customer/components/Modals/Modals';

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
    <>
      <Modals />
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] max-h-[93vh] overflow-hidden">
        <StoreSidebar />
        <div className="h-full flex flex-col ">
          <StoreHeader />
          <section className="min-h-[87vh] max-h-[87vh] overflow-auto">
            <Outlet />
          </section>
        </div>
      </div>
    </>
  ),
});
