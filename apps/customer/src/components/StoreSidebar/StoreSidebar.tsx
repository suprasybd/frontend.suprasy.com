import { Button } from '@frontend.suprasy.com/ui';
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
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from 'lucide-react';

import { Badge } from '@frontend.suprasy.com/ui';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@frontend.suprasy.com/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@frontend.suprasy.com/ui';
import { Input } from '@frontend.suprasy.com/ui';
import { Sheet, SheetContent, SheetTrigger } from '@frontend.suprasy.com/ui';
import { useSidebarStore } from '../../store/sidebarStore';
import styles from './StoreSidebar.module.scss';

const StoreSidebar = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };
  const isSidebarOpen = useSidebarStore((state) => state.isSideBarOpen);
  const toggleSideBar = useSidebarStore((state) => state.toggleSideBar);
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <a href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Acme Inc</span>
          </a>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <ShoppingCart className="h-4 w-4" />
              Orders
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                6
              </Badge>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
            >
              <Package className="h-4 w-4" />
              Products{' '}
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Users className="h-4 w-4" />
              Customers
            </a>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <LineChart className="h-4 w-4" />
              Analytics
            </a>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Card x-chunk="dashboard-02-chunk-0">
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>
                Unlock all features and get unlimited access to our support
                team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    // <div
    //   className={cn(
    //     'min-h-[93vh] fixed top-0 transition-all duration-200 -translate-x-60 z-10 overflow-scroll flex flex-row bg-gray-100 border border-r-2',
    //     isSidebarOpen && '!translate-x-0',
    //     'sm:translate-x-0 sm:relative sm:overflow-hidden'
    //   )}
    // >
    //   <div className="flex flex-col w-56 bg-white  overflow-hidden">
    //     <div className="flex items-center justify-center mt-2 sm:hidden">
    //       <Button onClick={() => toggleSideBar()} variant={'destructive'}>
    //         Close <X />
    //       </Button>
    //     </div>
    //     <ul className="flex flex-col py-4">
    //       <li>
    //         <Link
    //           to="/store/$storeKey/dashboard"
    //           params={{
    //             storeKey: storeKey,
    //           }}
    //           className={cn(
    //             styles['link'],
    //             'flex flex-row items-center h-12 transform  transition-transform [&.active]:!bg-gray-100  ease-in duration-200  text-gray-500 hover:text-gray-800 [&.active]:border-l-2 [&.active]:border-blue-600'
    //           )}
    //         >
    //           <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
    //             <Microwave className="" />
    //           </span>
    //           <span className="text-sm font-medium">Dashboard</span>
    //         </Link>
    //       </li>
    //       <li>
    //         <Link
    //           to="/store/$storeKey/orders"
    //           params={{ storeKey: storeKey }}
    //           className={cn(
    //             styles['link'],
    //             'flex flex-row items-center h-12 transform  transition-transform [&.active]:!bg-gray-100  ease-in duration-200  text-gray-500 hover:text-gray-800 [&.active]:border-l-2 [&.active]:border-blue-600'
    //           )}
    //         >
    //           <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
    //             <Folders />
    //           </span>
    //           <span className="text-sm font-medium">Orders</span>
    //         </Link>
    //       </li>
    //       <li>
    //         <Link
    //           to="/store/$storeKey/products"
    //           params={{ storeKey: storeKey }}
    //           className={cn(
    //             styles['link'],
    //             'flex flex-row items-center h-12 transform  transition-transform [&.active]:!bg-gray-100  ease-in duration-200  text-gray-500 hover:text-gray-800 [&.active]:border-l-2 [&.active]:border-blue-600'
    //           )}
    //         >
    //           <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
    //             <ShoppingBasket />
    //           </span>
    //           <span className="text-sm font-medium">Products</span>
    //         </Link>
    //       </li>
    //       <li>
    //         <Link
    //           to="/store/$storeKey/inventory"
    //           params={{ storeKey: storeKey }}
    //           className={cn(
    //             styles['link'],
    //             'flex flex-row items-center h-12 transform  transition-transform [&.active]:!bg-gray-100  ease-in duration-200  text-gray-500 hover:text-gray-800 [&.active]:border-l-2 [&.active]:border-blue-600'
    //           )}
    //         >
    //           <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
    //             <Layers3 />
    //           </span>
    //           <span className="text-sm font-medium">Category</span>
    //         </Link>
    //       </li>
    //       <li>
    //         <Link
    //           to="/store/$storeKey/customers"
    //           params={{ storeKey: storeKey }}
    //           className={cn(
    //             styles['link'],
    //             'flex flex-row items-center h-12 transform  transition-transform [&.active]:!bg-gray-100  ease-in duration-200  text-gray-500 hover:text-gray-800 [&.active]:border-l-2 [&.active]:border-blue-600'
    //           )}
    //         >
    //           <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
    //             <UsersRound />
    //           </span>
    //           <span className="text-sm font-medium">Customers</span>
    //         </Link>
    //       </li>
    //       <li>
    //         <Link
    //           to="/store/$storeKey/shipping"
    //           params={{ storeKey: storeKey }}
    //           className={cn(
    //             styles['link'],
    //             'flex flex-row items-center h-12 transform  transition-transform [&.active]:!bg-gray-100  ease-in duration-200  text-gray-500 hover:text-gray-800 [&.active]:border-l-2 [&.active]:border-blue-600'
    //           )}
    //         >
    //           <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
    //             <Truck />
    //           </span>
    //           <span className="text-sm font-medium">Shipping</span>
    //         </Link>
    //       </li>

    //       <li>
    //         <Link
    //           to="/store/$storeKey/payments"
    //           params={{ storeKey: storeKey }}
    //           className={cn(
    //             styles['link'],
    //             'flex flex-row items-center h-12 transform  transition-transform [&.active]:!bg-gray-100  ease-in duration-200  text-gray-500 hover:text-gray-800 [&.active]:border-l-2 [&.active]:border-blue-600'
    //           )}
    //         >
    //           <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
    //             <HandCoins />
    //           </span>
    //           <span className="text-sm font-medium">Recieve Payment</span>
    //         </Link>
    //       </li>
    //       <li>
    //         <Link
    //           to="/store/$storeKey/domain"
    //           params={{ storeKey: storeKey }}
    //           className={cn(
    //             styles['link'],
    //             'flex flex-row items-center h-12 transform  transition-transform [&.active]:!bg-gray-100  ease-in duration-200  text-gray-500 hover:text-gray-800 [&.active]:border-l-2 [&.active]:border-blue-600'
    //           )}
    //         >
    //           <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
    //             <Globe />
    //           </span>
    //           <span className="text-sm font-medium">Domain Settings</span>
    //         </Link>
    //       </li>
    //       <li>
    //         <Link
    //           to="/store/$storeKey/email"
    //           params={{ storeKey: storeKey }}
    //           className={cn(
    //             styles['link'],
    //             'flex flex-row items-center h-12 transform  transition-transform [&.active]:!bg-gray-100  ease-in duration-200  text-gray-500 hover:text-gray-800 [&.active]:border-l-2 [&.active]:border-blue-600'
    //           )}
    //         >
    //           <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
    //             <Mails />
    //           </span>
    //           <span className="text-sm font-medium">Email Settings</span>
    //         </Link>
    //       </li>

    //       <li>
    //         <Link
    //           to="/store/$storeKey/billing"
    //           params={{ storeKey: storeKey }}
    //           className={cn(
    //             styles['link'],
    //             'flex flex-row items-center h-12 transform  transition-transform [&.active]:!bg-gray-100  ease-in duration-200  text-gray-500 hover:text-gray-800 [&.active]:border-l-2 [&.active]:border-blue-600'
    //           )}
    //         >
    //           <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
    //             <CreditCard />
    //           </span>
    //           <span className="text-sm font-medium">Billing</span>
    //         </Link>
    //       </li>
    //     </ul>
    //   </div>
    // </div>
  );
};

export default StoreSidebar;
