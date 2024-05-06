import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getInventoryList } from './api';
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

import { Badge } from '@customer/components/index';
import { Button } from '@customer/components/index';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@customer/components/index';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@customer/components/index';
import { Input } from '@customer/components/index';
import { Sheet, SheetContent, SheetTrigger } from '@customer/components/index';
const Inventory: React.FC = () => {
  const { data: inventoryListResponse } = useQuery({
    queryKey: ['getInventoryList'],
    queryFn: getInventoryList,
  });

  const inventoryList = inventoryListResponse?.Data;

  console.log(inventoryList);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            You have no products
          </h3>
          <p className="text-sm text-muted-foreground">
            You can start selling as soon as you add a product.
          </p>
          <Button className="mt-4">Add Product</Button>
        </div>
      </div>
    </main>
  );
};

export default Inventory;
