import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserStoresProductsList } from '../products/api';
import { getStoreOrders } from '../orders/api';
import { getInventoryList } from '../inventory/api';
import { Link, useParams } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@customer/components/index';
import { Package2, ShoppingCart, LineChart, Plus } from 'lucide-react';

const Dashboard = () => {
  const { storeKey } = useParams({ strict: false });

  // Fetch products
  const { data: productsResponse } = useQuery({
    queryKey: ['getUserStoresProductsList'],
    queryFn: () => getUserStoresProductsList({ Page: 1, Limit: 10 }),
  });

  // Fetch orders
  const { data: ordersResponse } = useQuery({
    queryKey: ['getStoreOrders'],
    queryFn: () => getStoreOrders({ Page: 1, Limit: 10 }),
  });

  // Fetch inventory
  const { data: inventoryResponse } = useQuery({
    queryKey: ['getInventoryList'],
    queryFn: getInventoryList,
  });

  const totalProducts = productsResponse?.Pagination?.TotalItems || 0;
  const totalOrders = ordersResponse?.Pagination?.TotalItems || 0;
  const lowStockItems =
    inventoryResponse?.Data?.filter(
      (item) => item.storefront_variants.Inventory < 10
    )?.length || 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link
                to="/store/$storeKey/dashboard"
                params={{ storeKey: storeKey || '' }}
              >
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Dashboard</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Link
          to="/store/$storeKey/products/create"
          params={{ storeKey: storeKey || '' }}
        >
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
          </CardContent>
        </Card>
      </div>

      {totalProducts === 0 && (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no products
            </h3>
            <p className="text-sm text-muted-foreground">
              You can start selling as soon as you add a product.
            </p>
            <Link to={`/store/${storeKey}/products/create`}>
              <Button className="mt-4">Add Product</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
