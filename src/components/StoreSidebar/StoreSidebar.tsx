import { Link, useParams } from '@tanstack/react-router';
import {
  BarChartHorizontal,
  BrickWall,
  Container,
  FolderPen,
  Home,
  Link2,
  Package,
  Palette,
  Settings,
  ShoppingCart,
  Store,
  Tent,
  Users,
  CreditCard,
} from 'lucide-react';
import { Badge } from '@/components/index';
import { useQuery } from '@tanstack/react-query';
import { getStoreOrders } from '@/pages/orders/api';
import { getStoreDetails } from '@/pages/home/api';

// Improved link styles with better hover and active states
const linkStyles = `
  flex items-center gap-3 rounded-lg px-4 py-2.5 
  text-muted-foreground/90 transition-all duration-200
  hover:bg-muted/80 hover:text-foreground
  [&.active]:bg-muted/90 [&.active]:text-primary [&.active]:font-medium
`;

// Add section header styles
const sectionHeaderStyles = `
  text-xs font-semibold text-muted-foreground/70 px-4 py-2 uppercase tracking-wider
`;

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
    <div className="hidden border-r bg-background/95 md:block">
      <div className="flex h-full max-h-[93vh] flex-col">
        {/* Store Header */}
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <span className="flex items-center gap-2.5 font-semibold">
            <Store className="h-6 w-6 text-primary" />
            <span className="text-foreground">{storeData?.StoreName}</span>
          </span>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-3">
          <nav className="grid items-start gap-1 px-2 text-sm lg:px-3">
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
              <Link
                to="/store/$storeKey/genlink"
                params={{ storeKey }}
                className={linkStyles}
              >
                <Link2 className="h-4 w-4" />
                Direct Checkout
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
                className={linkStyles}
              >
                <BrickWall className="h-4 w-4" />
                Turnstile & Logo
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
              <Link
                to="/store/$storeKey/adminThemes"
                params={{ storeKey }}
                className={linkStyles}
              >
                <Settings className="h-4 w-4" />
                Admin Themes
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default StoreSidebar;
