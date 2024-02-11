import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { LayoutDashboard, LogOut, ShoppingBasket } from 'lucide-react';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex gap-2">
        <div className="min-h-screen flex flex-row bg-gray-100">
          <div className="flex flex-col w-56 bg-white  overflow-hidden">
            <div className="flex items-center justify-center h-20 ">
              <h1 className="text-3xl uppercase text-indigo-500">Suprasy</h1>
            </div>
            <ul className="flex flex-col py-4">
              <li>
                <Link
                  to="/"
                  className="flex flex-row items-center h-12 transform  transition-transform [&.active]:!bg-gray-200 ease-in duration-200  text-gray-500 hover:text-gray-800 "
                >
                  <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                    <LayoutDashboard />
                  </span>
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="flex flex-row items-center h-12 transform  transition-transform ease-in duration-200 [&.active]:!bg-gray-200 text-gray-500 hover:text-gray-800"
                >
                  <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                    <ShoppingBasket />
                  </span>
                  <span className="text-sm font-medium">Products</span>
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className="flex flex-row items-center h-12 transform  transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                >
                  <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                    <LogOut />
                  </span>
                  <span className="text-sm font-medium">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Outlet />
      </div>

      <TanStackRouterDevtools />
    </>
  ),
});
