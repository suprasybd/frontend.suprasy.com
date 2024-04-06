import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import BottomNav from '../components/BottomNav/BottomNav';
import NavBar from '../components/NavBar/NavBar';
import { AuthStoreType, useAuthStore } from '../store/authStore';
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
        <Outlet />
      </div>
      {/* {isAuthenticated && <BottomNav />} */}

      {/* <TanStackRouterDevtools /> */}
    </>
  );
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => <RootComponent />,
});
