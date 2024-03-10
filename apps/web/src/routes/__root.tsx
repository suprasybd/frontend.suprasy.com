import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

const RootComponent: React.FC = () => {
  return (
    <>
      test
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </>
  );
};
interface MyRouterContext {
  hasCookie: boolean;
}
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => <RootComponent />,
});
