import React from 'react';
import { Folders, LogOut, Microwave, ShoppingBasket } from 'lucide-react';
import cn from 'classnames';
import styles from './Sidebar.module.scss';
import { Link } from '@tanstack/react-router';

const Sidebar = () => {
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
              to="/store/$storeKey/layout/products"
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
              to="/"
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
  );
};

export default Sidebar;
