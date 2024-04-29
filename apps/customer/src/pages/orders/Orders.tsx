import React, { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@frontend.suprasy.com/ui';
import { Link, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getStoreOrders } from './api';
import { DataTable } from '@customer/components/Table/table';
import { ordersColumn } from './columns';
import PaginationMain from '@customer/components/Pagination/Pagination';
const Orders = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [tab, setTab] = useState<string>('pending');

  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ['getStoreOrders', page, limit, tab],
    queryFn: () => getStoreOrders({ Limit: limit, Page: page, Status: tab }),
  });

  const orders = ordersResponse?.Data;

  return (
    <section className="w-full min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      {/* breadcrumbs */}
      <Breadcrumb className="pb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link
              to="/store/$storeKey/dashboard"
              params={{ storeKey: storeKey }}
            >
              Home
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link to="/store/$storeKey/orders" params={{ storeKey: storeKey }}>
              Orders
            </Link>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Tabs
        onValueChange={(val) => {
          setTab(val);
        }}
        defaultValue={tab}
        className="w-[400px]"
      >
        <TabsList className="mb-5">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancled">Cancled</TabsTrigger>
        </TabsList>
      </Tabs>

      {!isLoading && orders && orders?.length > 0 && (
        <DataTable columns={ordersColumn} data={orders || []} />
      )}

      {ordersResponse?.Pagination && (
        <PaginationMain
          PaginationDetails={ordersResponse?.Pagination}
          setPage={setPage}
        />
      )}
    </section>
  );
};

export default Orders;
