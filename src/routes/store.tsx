import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import StoreSidebar from '../components/StoreSidebar/StoreSidebar';
import StoreHeader from '../components/StoreHeader/StoreHeader';
import Cookies from 'js-cookie';
import StoreModals from '@/components/Modals/StoreModals';

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
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] max-h-[93vh] overflow-hidden">
      <StoreSidebar />
      <div className="h-full flex flex-col ">
        <StoreModals />
        <StoreHeader />
        <section className="min-h-[87vh] max-h-[87vh] overflow-auto">
          <Outlet />
        </section>
      </div>
    </div>
  ),
});
