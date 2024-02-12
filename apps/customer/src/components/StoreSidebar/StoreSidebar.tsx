import { Button } from '@frontend.suprasy.com/ui';
import { Link } from '@tanstack/react-router';
import cn from 'classnames';
import {
  CreditCard,
  Folders,
  Globe,
  HandCoins,
  LogOut,
  Mails,
  Microwave,
  ShoppingBasket,
  UsersRound,
} from 'lucide-react';
import { logoutUser } from '../../config/profile/logout';
import styles from './StoreSidebar.module.scss';

const StoreSidebar = () => {
  return (
    <div className="min-h-screen flex flex-row bg-gray-100 border border-r-2">
      <div className="flex flex-col w-56 bg-white  overflow-hidden">
        <div className="flex items-center justify-center h-20 ">
          <h1 className="text-3xl uppercase text-indigo-500">Suprasy</h1>
        </div>
        <ul className="flex flex-col py-4">
          <li>
            <Link
              to="/store/$storeKey/dashboard"
              params={{
                storeKey: '1234',
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
              params={{ storeKey: '1234' }}
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
              params={{ storeKey: '1234' }}
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
          <li>
            <Link
              to="/store/$storeKey/customers"
              params={{ storeKey: '1234' }}
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
              to="/store/$storeKey/payments"
              params={{ storeKey: '1234' }}
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
              params={{ storeKey: '1234' }}
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
              params={{ storeKey: '1234' }}
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
              params={{ storeKey: '1234' }}
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

        <Button className="w-fit" variant={'default'} onClick={logoutUser}>
          <span className="inline-flex items-center justify-center h-12 w-12 text-lg ">
            <LogOut className="" />
          </span>
          <span className="text-sm font-medium  ">Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default StoreSidebar;
