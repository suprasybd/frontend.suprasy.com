import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  Button,
} from '@frontend.suprasy.com/ui';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import React from 'react';
import { LoaderMain } from '../../components/Loader/Loader';
import { DataTable } from '../../components/Table/table';
import { getUserStoresProductsList } from './api';
import { productsColumn } from './table/columns';

const Products: React.FC = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };
  const { data: products, isLoading } = useQuery({
    queryKey: ['getUserStoresProductsList', storeKey],
    queryFn: getUserStoresProductsList,
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
        <div className="flex min-h-[50vh] flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
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
    </section>
  );
};

export default Products;
