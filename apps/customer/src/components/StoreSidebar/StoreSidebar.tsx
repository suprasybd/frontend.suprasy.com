import { Link, useParams } from '@tanstack/react-router';
import {
  BarChartHorizontal,
  BrickWall,
  Container,
  FolderPen,
  Home,
  Link2,
  Package,
  ShoppingCart,
  Store,
  Tent,
  Users,
} from 'lucide-react';

import { Badge } from '@customer/components/index';

import { useQuery } from '@tanstack/react-query';
import { getStoreOrders } from '@customer/pages/orders/api';
import { getStoreDetails } from '@customer/pages/home/api';

const StoreSidebar = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };

  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ['getStoreOrders', 1, 5, 'pending'],
    queryFn: () => getStoreOrders({ Limit: 10, Page: 1, Status: 'pending' }),
  });

  const { data: storeDetailsResponse } = useQuery({
    queryKey: ['getStoreDetails'],
    queryFn: () => getStoreDetails(storeKey),
  });

  const storeData = storeDetailsResponse?.Data;

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-[93vh]  flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <span className="flex items-center gap-2 font-semibold">
            <Store className="h-6 w-6" />

            <span className="">{storeData?.StoreName}</span>
          </span>
          {/* <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button> */}
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {/* <Link
              to="/store/$storeKey/dashboard"
              params={{
                storeKey: storeKey,
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:bg-muted
              [&.active]:text-primary
              [&.active]:transition-all
              [&.active]:hover:text-primary"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link> */}
            <Link
              to="/store/$storeKey/orders"
              params={{
                storeKey: storeKey,
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:bg-muted
              [&.active]:text-primary
              [&.active]:transition-all
              [&.active]:hover:text-primary"
            >
              <ShoppingCart className="h-4 w-4" />
              Orders
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {!isLoading && ordersResponse?.Pagination && (
                  <>{ordersResponse.Pagination.TotalItems}</>
                )}
              </Badge>
            </Link>
            <Link
              to="/store/$storeKey/products"
              params={{
                storeKey: storeKey,
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:bg-muted
              [&.active]:text-primary
              [&.active]:transition-all
              [&.active]:hover:text-primary"
            >
              <Package className="h-4 w-4" />
              Products{' '}
            </Link>
            <Link
              to="/store/$storeKey/customers"
              params={{
                storeKey: storeKey,
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:bg-muted
              [&.active]:text-primary
              [&.active]:transition-all
              [&.active]:hover:text-primary"
            >
              <Users className="h-4 w-4" />
              Customers
            </Link>

            <Link
              to="/store/$storeKey/categories"
              params={{
                storeKey: storeKey,
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:bg-muted
              [&.active]:text-primary
              [&.active]:transition-all
              [&.active]:hover:text-primary"
            >
              <BarChartHorizontal className="h-4 w-4" />
              Categories
            </Link>

            <Link
              to="/store/$storeKey/home"
              params={{
                storeKey: storeKey,
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:bg-muted
              [&.active]:text-primary
              [&.active]:transition-all
              [&.active]:hover:text-primary"
            >
              <Home className="h-4 w-4" />
              Home Page
            </Link>

            <Link
              to="/store/$storeKey/shipping"
              params={{
                storeKey: storeKey,
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:bg-muted
              [&.active]:text-primary
              [&.active]:transition-all
              [&.active]:hover:text-primary"
            >
              <Container className="h-4 w-4" />
              Shipping
            </Link>

            <Link
              to="/store/$storeKey/footer"
              params={{
                storeKey: storeKey,
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:bg-muted
              [&.active]:text-primary
              [&.active]:transition-all
              [&.active]:hover:text-primary"
            >
              <Tent className="h-4 w-4" />
              Pages & Footer
            </Link>

            <Link
              to="/store/$storeKey/turnstile"
              params={{
                storeKey: storeKey,
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:bg-muted
              [&.active]:text-primary
              [&.active]:transition-all
              [&.active]:hover:text-primary"
            >
              <BrickWall className="h-4 w-4" />
              Trunstile & Logo
            </Link>

            <Link
              to="/store/$storeKey/genlink"
              params={{
                storeKey: storeKey,
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:bg-muted
              [&.active]:text-primary
              [&.active]:transition-all
              [&.active]:hover:text-primary"
            >
              <Link2 className="h-4 w-4" />
              Generate Direct Product Purchase Link
            </Link>

            <Link
              to="/store/$storeKey/domain"
              params={{
                storeKey: storeKey,
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:bg-muted
              [&.active]:text-primary
              [&.active]:transition-all
              [&.active]:hover:text-primary"
            >
              <FolderPen className="h-4 w-4" />
              Domain Name
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default StoreSidebar;
