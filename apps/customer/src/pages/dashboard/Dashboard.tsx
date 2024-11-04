import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserStoresProductsList } from '../products/api';
import { getStoreOrders } from '../orders/api';
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
import {
  Package2,
  ShoppingCart,
  Plus,
  BarChartHorizontal,
  Users,
  Image,
  FileText,
} from 'lucide-react';
import { getAllCategories } from '../categories/api';
import { getStoreCustomers } from '../customers/api';
import { getStoreImages } from '../../components/Modals/MediaModal/api';
import { getFooter, getAllPage } from '../footer/api';

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

  // Additional queries
  const { data: categoriesResponse } = useQuery({
    queryKey: ['getAllCategories'],
    queryFn: getAllCategories,
  });

  const { data: customersResponse } = useQuery({
    queryKey: ['getStoreCustomers'],
    queryFn: () => getStoreCustomers({ Page: 1, Limit: 10 }),
  });

  const { data: mediaResponse } = useQuery({
    queryKey: ['getStoreImages'],
    queryFn: () => getStoreImages(1, 10),
  });

  const { data: pagesResponse } = useQuery({
    queryKey: ['getAllPages'],
    queryFn: getAllPage,
  });

  const totalProducts = productsResponse?.Pagination?.TotalItems || 0;
  const totalOrders = ordersResponse?.Pagination?.TotalItems || 0;
  const totalCategories = categoriesResponse?.Data?.length || 0;
  const totalCustomers = customersResponse?.Pagination?.TotalItems || 0;
  const totalMedia = mediaResponse?.Pagination?.TotalItems || 0;
  const totalPages = pagesResponse?.Data?.length || 0;

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
              Total Categories
            </CardTitle>
            <BarChartHorizontal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Media Files</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMedia}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPages}</div>
          </CardContent>
        </Card>

        {/* Recent Orders Section */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersResponse?.Data && ordersResponse.Data.length > 0 ? (
              <div className="space-y-4">
                {ordersResponse.Data.slice(0, 5).map((order) => (
                  <div
                    key={order.Id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div>
                      <p className="font-medium">Order #{order.Id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.FullName} • {order.Phone}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.Status}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.CreatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                <Link
                  to="/store/$storeKey/orders"
                  params={{ storeKey: storeKey || '' }}
                >
                  <Button variant="outline" className="w-full">
                    View All Orders
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                No recent orders
              </p>
            )}
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
