import React, { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  Button,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@customer/components/index';
import { Link, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getStoreOrders } from './api';
import { DataTable } from '@customer/components/Table/table';
import { ordersColumn } from './columns';
import PaginationMain from '@customer/components/Pagination/Pagination';
import { LoaderMain } from '@customer/components/Loader/Loader';
import { activeFilters } from '@customer/libs/helpers/filters';
import { Search } from 'lucide-react';
const Orders = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [tab, setTab] = useState<string>('pending');

  // filters
  const [phone, setPhone] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [id, setId] = useState<string>();

  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ['getStoreOrders', storeKey, page, limit, tab, phone, email, id],
    queryFn: () =>
      getStoreOrders({
        Limit: limit,
        Page: page,
        Status: tab,
        ...activeFilters([
          { key: 'Phone', value: phone || '', isActive: !!phone },
          { key: 'Email', value: email || '', isActive: !!email },
          { key: 'Id', value: id || '', isActive: !!id },
        ]),
      }),
    enabled: !!storeKey,
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

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Orders Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem className="border-none" value="item-1">
              <AccordionTrigger className="hover:no-underline py-2 px-4 rounded-lg bg-secondary/10">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>Search & Filters</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Search by phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Search by email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Order ID</Label>
                    <Input
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      type="number"
                      placeholder="Search by ID"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Tabs
            onValueChange={setTab}
            defaultValue={tab}
            className="w-full mt-6"
          >
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="unverified">Unverified</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancled">Cancelled</TabsTrigger>
              <TabsTrigger value="returned">Returned</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading && (
            <div className="w-full flex justify-center py-8">
              <LoaderMain />
            </div>
          )}

          {!isLoading && !orders?.length && (
            <div className="text-center py-8 text-muted-foreground">
              No orders found
            </div>
          )}

          {!isLoading && orders && orders?.length > 0 && (
            <div className="mt-4">
              <DataTable columns={ordersColumn} data={orders} />
            </div>
          )}

          {ordersResponse?.Pagination && (
            <div className="mt-4 flex justify-end">
              <PaginationMain
                PaginationDetails={ordersResponse.Pagination}
                setPage={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default Orders;
