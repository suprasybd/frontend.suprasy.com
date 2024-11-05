import React from 'react';

import { Home, Menu, Package, ShoppingCart } from 'lucide-react';

import { Button } from '@/components/index';
import { Sheet, SheetContent, SheetTrigger } from '@/components/index';
import { Link, useParams } from '@tanstack/react-router';

import {
  BarChartHorizontal,
  BrickWall,
  Container,
  FolderPen,
  Link2,
  Tent,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/index';

import { useQuery } from '@tanstack/react-query';
import { getStoreOrders } from '@/pages/orders/api';
import { getStoreDetails } from '@/pages/home/api';
const StoreHeader: React.FC = () => {
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
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium overflow-y-scroll">
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
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default StoreHeader;
