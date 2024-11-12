import React from 'react';

import {
  AlertTriangle,
  CreditCard,
  Home,
  Menu,
  Package,
  Palette,
  Settings,
  Shield,
  ShoppingCart,
} from 'lucide-react';

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
import { useAuthStore } from '@/store/authStore';
import { getTurnstile } from '@/pages/turnstile/api';

// Add these style constants
const linkStyles = `
  flex items-center gap-3 rounded-lg px-4 py-2.5 
  text-muted-foreground/90 transition-all duration-200
  hover:bg-muted/80 hover:text-foreground
  [&.active]:bg-muted/90 [&.active]:text-primary [&.active]:font-medium
`;

const sectionHeaderStyles = `
  text-xs font-semibold text-muted-foreground/70 px-4 py-2 uppercase tracking-wider
`;

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

  const user = useAuthStore((state) => state.user);

  const { data: turnstileData } = useQuery({
    queryKey: ['getTurnstile'],
    queryFn: getTurnstile,
  });

  const isTurnstileConfigured =
    turnstileData?.Data?.TurnstileKey && turnstileData?.Data?.TurnstileSecret;

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          {/* Store Header */}
          <div className="flex h-14 items-center border-b px-4">
            <span className="flex items-center gap-2.5 font-semibold">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-foreground">{storeData?.StoreName}</span>
            </span>
          </div>

          <nav className="flex-1 overflow-y-auto py-3">
            <div className="grid gap-1 text-sm px-2">
              {/* Main Navigation */}
              <div className="space-y-1">
                <Link
                  to="/store/$storeKey/dashboard"
                  params={{ storeKey }}
                  className={linkStyles}
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  to="/store/$storeKey/orders"
                  params={{ storeKey }}
                  className={linkStyles}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Orders
                  {!isLoading && ordersResponse?.Pagination && (
                    <Badge className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs">
                      {ordersResponse.Pagination.TotalItems}
                    </Badge>
                  )}
                </Link>
                <Link
                  to="/store/$storeKey/products"
                  params={{ storeKey }}
                  className={linkStyles}
                >
                  <Package className="h-4 w-4" />
                  Products
                </Link>
                <Link
                  to="/store/$storeKey/categories"
                  params={{ storeKey }}
                  className={linkStyles}
                >
                  <BarChartHorizontal className="h-4 w-4" />
                  Categories
                </Link>
                <Link
                  to="/store/$storeKey/customers"
                  params={{ storeKey }}
                  className={linkStyles}
                >
                  <Users className="h-4 w-4" />
                  Customers
                </Link>
              </div>

              {/* Store Management */}
              <div className="mt-4 space-y-1">
                <div className={sectionHeaderStyles}>Store Management</div>
                <Link
                  to="/store/$storeKey/home"
                  params={{ storeKey }}
                  className={linkStyles}
                >
                  <Home className="h-4 w-4" />
                  Home Page
                </Link>
                <Link
                  to="/store/$storeKey/shipping"
                  params={{ storeKey }}
                  className={linkStyles}
                >
                  <Container className="h-4 w-4" />
                  Shipping
                </Link>
                <Link
                  to="/store/$storeKey/footer"
                  params={{ storeKey }}
                  className={linkStyles}
                >
                  <Tent className="h-4 w-4" />
                  Pages & Footer
                </Link>
              </div>

              {/* Settings & Admin */}
              <div className="mt-4 space-y-1">
                <div className={sectionHeaderStyles}>Settings</div>
                <Link
                  to="/store/$storeKey/subscription"
                  params={{ storeKey }}
                  className={linkStyles}
                >
                  <CreditCard className="h-4 w-4" />
                  Subscription
                </Link>
                <Link
                  to="/store/$storeKey/turnstile"
                  params={{ storeKey }}
                  className={`${linkStyles} ${
                    !isTurnstileConfigured
                      ? 'bg-destructive/10 hover:bg-destructive/20 border border-destructive/50 font-medium'
                      : ''
                  }`}
                >
                  <Shield
                    className={`h-4 w-4 ${
                      !isTurnstileConfigured ? 'text-destructive' : ''
                    }`}
                  />
                  <span className="flex items-center gap-2">
                    Turnstile & Logo
                    {!isTurnstileConfigured && (
                      <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />
                    )}
                  </span>
                </Link>
                <Link
                  to="/store/$storeKey/domain"
                  params={{ storeKey }}
                  className={linkStyles}
                >
                  <FolderPen className="h-4 w-4" />
                  Domain Name
                </Link>
                <Link
                  to="/store/$storeKey/themes"
                  params={{ storeKey }}
                  className={linkStyles}
                >
                  <Palette className="h-4 w-4" />
                  Themes
                </Link>
                {user?.Role === 'admin' && (
                  <Link
                    to="/store/$storeKey/adminThemes"
                    params={{ storeKey }}
                    className={linkStyles}
                  >
                    <Settings className="h-4 w-4" />
                    Admin Themes
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default StoreHeader;
