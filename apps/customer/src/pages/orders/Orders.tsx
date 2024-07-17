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

      <Accordion type="single" collapsible defaultChecked defaultValue="item-1">
        <AccordionItem className="border-b-0" value="item-1">
          <AccordionTrigger className="hover:no-underline border-b-0">
            <Button variant={'defaultGradiant'}>
              Filters / Search <Search className="ml-3" />
            </Button>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-[10px]">
              <div className="w-[300px]">
                <Label className="my-2">Filter Phone</Label>
                <Input
                  className="my-2"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Filter using phone"
                />
              </div>

              <div className="w-[300px]">
                <Label className="my-2">Filter Email</Label>
                <Input
                  className="my-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Filter using email"
                />
              </div>
              <div className="w-[300px]">
                <Label className="my-2">Filter Order Id</Label>
                <Input
                  className="my-2"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  type="number"
                  placeholder="Filter using id"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Tabs
        onValueChange={(val) => {
          setTab(val);
        }}
        defaultValue={tab}
        className="w-[400px]"
      >
        <TabsList className="mb-5">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="unverified">Unverified</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancled">Cancled</TabsTrigger>
          <TabsTrigger value="returned">Returned</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading && <LoaderMain />}
      {!isLoading && !orders?.length && <div>No orders found!</div>}

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
