import { Link, useParams } from '@tanstack/react-router';
import cn from 'classnames';
import {
  CreditCard,
  Folders,
  Globe,
  HandCoins,
  Layers3,
  Mails,
  Microwave,
  ShoppingBasket,
  Truck,
  UsersRound,
  X,
} from 'lucide-react';
import styles from './StoreSidebar.module.scss';
import { useSidebarStore } from '../../store/sidebarStore';
import { Button } from '@frontend.suprasy.com/ui';

const StoreSidebar = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };
  const isSidebarOpen = useSidebarStore((state) => state.isSideBarOpen);
  const toggleSideBar = useSidebarStore((state) => state.toggleSideBar);
  return (
    <div
      className={cn(
        'min-h-screen fixed top-0 transition-all duration-200 -translate-x-60 z-10 overflow-scroll flex flex-row bg-gray-100 border border-r-2',
        isSidebarOpen && '!translate-x-0',
        'sm:translate-x-0 sm:relative sm:overflow-hidden'
      )}
    >
      <div className="flex flex-col w-56 bg-white  overflow-hidden">
        <div className="flex items-center justify-center mt-2 sm:hidden">
          <Button onClick={() => toggleSideBar()} variant={'destructive'}>
            Close <X />
          </Button>
        </div>
        <ul className="flex flex-col py-4">
          <li>
            <Link
              to="/store/$storeKey/dashboard"
              params={{
                storeKey: storeKey,
              }}
              className={cn(
                styles['link'],
                'flex flex-row items-center h-12 transform  transition-transform [&.active]:!bg-gray-100  ease-in duration-200  text-gray-500 hover:text-gray-800 [&.active]:border-l-2 [&.active]:border-blue-600'
              )}
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                <Microwave className="" />
              </span>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/store/$storeKey/orders"
              params={{ storeKey: storeKey }}
              className={cn(
                styles['link'],
                'flex flex-row items-center h-12 transform  transition-transform [&.active]:!bg-gray-100  ease-in duration-200  text-gray-500 hover:text-gray-800 [&.active]:border-l-2 [&.active]:border-blue-600'
              )}
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                <Folders />
              </span>
              <span className="text-sm font-medium">Orders</span>
            </Link>
          </li>
          <li>
            <Link
              to="/store/$storeKey/products"
              params={{ storeKey: storeKey }}
              className={cn(
                styles['link'],
                'flex flex-row items-center h-12 transform  transition-transform [&.active]:!bg-gray-100  ease-in duration-200  text-gray-500 hover:text-gray-800 [&.active]:border-l-2 [&.active]:border-blue-600'
              )}
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                <ShoppingBasket />
              </span>
              <span className="text-sm font-medium">Products</span>
            </Link>
          </li>
          {/* <li>
            <Link
              to="/store/$storeKey/inventory"
              params={{ storeKey: storeKey }}
              className={cn(
                styles['link'],
                'flex flex-row items-center h-12 transform  transition-transform [&.active]:!bg-gray-100  ease-in duration-200  text-gray-500 hover:text-gray-800 [&.active]:border-l-2 [&.active]:border-blue-600'
              )}
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                <Layers3 />
              </span>
              <span className="text-sm font-medium">Inventory</span>
            </Link>
          </li> */}
          <li>
            <Link
              to="/store/$storeKey/customers"
              params={{ storeKey: storeKey }}
              className={cn(
                styles['link'],
                'flex flex-row items-center h-12 transform  transition-transform [&.active]:!bg-gray-100  ease-in duration-200  text-gray-500 hover:text-gray-800 [&.active]:border-l-2 [&.active]:border-blue-600'
              )}
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                <UsersRound />
              </span>
              <span className="text-sm font-medium">Customers</span>
            </Link>
          </li>
          <li>
            <Link
              to="/store/$storeKey/shipping"
              params={{ storeKey: storeKey }}
              className={cn(
                styles['link'],
                'flex flex-row items-center h-12 transform  transition-transform [&.active]:!bg-gray-100  ease-in duration-200  text-gray-500 hover:text-gray-800 [&.active]:border-l-2 [&.active]:border-blue-600'
              )}
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                <Truck />
              </span>
              <span className="text-sm font-medium">Shipping</span>
            </Link>
          </li>

          <li>
            <Link
              to="/store/$storeKey/payments"
              params={{ storeKey: storeKey }}
              className={cn(
                styles['link'],
                'flex flex-row items-center h-12 transform  transition-transform [&.active]:!bg-gray-100  ease-in duration-200  text-gray-500 hover:text-gray-800 [&.active]:border-l-2 [&.active]:border-blue-600'
              )}
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                <HandCoins />
              </span>
              <span className="text-sm font-medium">Recieve Payment</span>
            </Link>
          </li>
          <li>
            <Link
              to="/store/$storeKey/domain"
              params={{ storeKey: storeKey }}
              className={cn(
                styles['link'],
                'flex flex-row items-center h-12 transform  transition-transform [&.active]:!bg-gray-100  ease-in duration-200  text-gray-500 hover:text-gray-800 [&.active]:border-l-2 [&.active]:border-blue-600'
              )}
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                <Globe />
              </span>
              <span className="text-sm font-medium">Domain Settings</span>
            </Link>
          </li>
          <li>
            <Link
              to="/store/$storeKey/email"
              params={{ storeKey: storeKey }}
              className={cn(
                styles['link'],
                'flex flex-row items-center h-12 transform  transition-transform [&.active]:!bg-gray-100  ease-in duration-200  text-gray-500 hover:text-gray-800 [&.active]:border-l-2 [&.active]:border-blue-600'
              )}
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                <Mails />
              </span>
              <span className="text-sm font-medium">Email Settings</span>
            </Link>
          </li>

          <li>
            <Link
              to="/store/$storeKey/billing"
              params={{ storeKey: storeKey }}
              className={cn(
                styles['link'],
                'flex flex-row items-center h-12 transform  transition-transform [&.active]:!bg-gray-100  ease-in duration-200  text-gray-500 hover:text-gray-800 [&.active]:border-l-2 [&.active]:border-blue-600'
              )}
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                <CreditCard />
              </span>
              <span className="text-sm font-medium">Billing</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StoreSidebar;
