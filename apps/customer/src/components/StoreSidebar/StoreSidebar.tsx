import { Button } from '@frontend.suprasy.com/ui';
import { Link, useParams } from '@tanstack/react-router';
import {
  Bell,
  Container,
  GalleryVerticalEnd,
  Home,
  LineChart,
  Package,
  Package2,
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

const StoreSidebar = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-[93vh]  flex-col gap-2">
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
            <Link
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
            </Link>
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
                6
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
              to="/store/$storeKey/analytics"
              params={{
                storeKey: storeKey,
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:bg-muted
              [&.active]:text-primary
              [&.active]:transition-all
              [&.active]:hover:text-primary"
            >
              <LineChart className="h-4 w-4" />
              Analytics
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
              to="/store/$storeKey/media"
              params={{
                storeKey: storeKey,
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:bg-muted
              [&.active]:text-primary
              [&.active]:transition-all
              [&.active]:hover:text-primary"
            >
              <GalleryVerticalEnd className="h-4 w-4" />
              Media
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default StoreSidebar;
