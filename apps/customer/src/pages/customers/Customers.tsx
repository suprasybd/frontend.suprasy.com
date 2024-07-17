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
} from '@customer/components/index';
import { Link, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getStoreCustomers } from './api';
import { DataTable } from '@customer/components/Table/table';
import { customersColumn } from './columns';
import PaginationMain from '@customer/components/Pagination/Pagination';
import { LoaderMain } from '@customer/components/Loader/Loader';
import { activeFilters } from '@customer/libs/helpers/filters';
import { Search } from 'lucide-react';
const CustomersPage = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [tab, setTab] = useState<string>('pending');

  // filters
  const [phone, setPhone] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [id, setId] = useState<string>();

  const { data: customersResponse, isLoading } = useQuery({
    queryKey: ['getCustomersList', storeKey, page, limit, email],
    queryFn: () =>
      getStoreCustomers({
        Limit: limit,
        Page: page,

        ...activeFilters([
          { key: 'Phone', value: phone || '', isActive: !!phone },
          { key: 'Email', value: email || '', isActive: !!email },
          { key: 'Id', value: id || '', isActive: !!id },
        ]),
      }),
    enabled: !!storeKey,
  });

  const customers = customersResponse?.Data;

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
            <Link
              to="/store/$storeKey/customers"
              params={{ storeKey: storeKey }}
            >
              Customers
            </Link>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Accordion type="single" collapsible>
        <AccordionItem className="border-b-0" value="item-1">
          <AccordionTrigger className="hover:no-underline border-b-0">
            <Button variant={'defaultGradiant'}>
              Filters / Search <Search className="ml-3" />
            </Button>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-[10px]">
              {/* <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Filter using phone"
              /> */}
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Filter using email"
              />
              {/* <Input
                value={id}
                onChange={(e) => setId(e.target.value)}
                type="number"
                placeholder="Filter using id"
              /> */}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {isLoading && <LoaderMain />}
      {!isLoading && !customers?.length && <div>No customers found!</div>}

      {!isLoading && customers && customers?.length > 0 && (
        <DataTable columns={customersColumn} data={customers || []} />
      )}

      {customersResponse?.Pagination && (
        <PaginationMain
          PaginationDetails={customersResponse?.Pagination}
          setPage={setPage}
        />
      )}
    </section>
  );
};

export default CustomersPage;
