import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from '@tanstack/react-router';
import NavBar from '../components/NavBar/NavBar';
import { AuthStoreType, useAuthStore } from '../store/authStore';
import Modals from '@customer/components/Modals/Modals';
interface MyRouterContext {
  auth: AuthStoreType | undefined;
  hasCookie: boolean;
}

const RootComponent: React.FC = () => {
  const { isAuthenticated } = useAuthStore((state) => state);
  return (
    <>
      {isAuthenticated && <NavBar />}

      <div className="flex gap-2 ">
        <Modals />
        <Outlet />
      </div>
      <ScrollRestoration />

      {/* <TanStackRouterDevtools /> */}
    </>
  );
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => <RootComponent />,
});
