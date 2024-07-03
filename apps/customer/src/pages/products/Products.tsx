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
} from '@customer/components/index';

import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { LoaderMain } from '../../components/Loader/Loader';
import { DataTable } from '../../components/Table/table';
import { getUserStoresProductsList } from './api';
import { productsColumn } from './table/columns';
import PaginationMain from '@customer/components/Pagination/Pagination';

const Products: React.FC = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [tab, setTab] = useState('draft');

  const { data: products, isLoading } = useQuery({
    queryKey: ['getUserStoresProductsList', storeKey, tab, page, limit],
    queryFn: () =>
      getUserStoresProductsList({ Status: tab, Page: page, Limit: limit }),
    enabled: !!storeKey,
  });

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
              to="/store/$storeKey/products"
              params={{ storeKey: storeKey }}
            >
              Products
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
        <TabsList>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>
      {isLoading && <LoaderMain />}
      {!isLoading && products?.Data && products?.Data?.length > 0 && (
        <Button className="mt-3 my-6" variant={'defaultGradiant'}>
          <Link
            className="flex items-center justify-center"
            to="/store/$storeKey/products/create"
            params={{ storeKey }}
          >
            <Plus className="mr-2" /> Create Product
          </Link>
        </Button>
      )}
      {!isLoading && !products?.Data?.length && (
        <div className="flex min-h-[50vh] mt-3 flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no products
            </h3>
            <p className="text-sm text-muted-foreground">
              You can start selling as soon as you add a product.
            </p>
            <Button className="mt-4">
              {' '}
              <Link
                className="flex items-center justify-center"
                to="/store/$storeKey/products/create"
                params={{ storeKey }}
              >
                <Plus className="mr-2" /> Add Product
              </Link>
            </Button>
          </div>
        </div>
      )}
      {!isLoading && products?.Data && products?.Data?.length > 0 && (
        <DataTable columns={productsColumn} data={products?.Data || []} />
      )}

      {products?.Pagination && (
        <PaginationMain
          PaginationDetails={products?.Pagination}
          setPage={setPage}
        />
      )}
    </section>
  );
};

export default Products;
