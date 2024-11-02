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
  CardHeader,
  CardTitle,
  CardContent,
} from '@customer/components/index';
import { Link, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getStoreCustomers } from './api';
import { DataTable } from '@customer/components/Table/table';
import { customersColumn } from './columns';
import PaginationMain from '@customer/components/Pagination/Pagination';
import { LoaderMain } from '@customer/components/Loader/Loader';
import { activeFilters } from '@customer/libs/helpers/filters';
import { Search, Users } from 'lucide-react';
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
      {/* Header section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Customers</h1>
          <Breadcrumb className="text-sm text-muted-foreground">
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
        </div>
      </div>

      {/* Main content card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <div className="flex items-center gap-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem className="border-b-0" value="item-1">
                <AccordionTrigger className="hover:no-underline">
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Filter by email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Filter by phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Customer ID</Label>
                      <Input
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        type="number"
                        placeholder="Filter by ID"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading && (
            <div className="flex justify-center py-8">
              <LoaderMain />
            </div>
          )}

          {!isLoading && !customers?.length && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No customers found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or add new customers
              </p>
            </div>
          )}

          {!isLoading && customers && customers?.length > 0 && (
            <div className="space-y-4">
              <DataTable columns={customersColumn} data={customers || []} />

              {customersResponse?.Pagination && (
                <div className="flex justify-end">
                  <PaginationMain
                    PaginationDetails={customersResponse?.Pagination}
                    setPage={setPage}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default CustomersPage;
