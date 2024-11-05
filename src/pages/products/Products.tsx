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
  Input,
  Badge,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/index';

import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import { Plus, Search, Filter, MoreHorizontal, Package2 } from 'lucide-react';
import React, { useState } from 'react';
import { LoaderMain } from '../../components/Loader/Loader';
import { DataTable } from '../../components/Table/table';
import { getUserStoresProductsList } from './api';
import { productsColumn } from './table/columns';
import PaginationMain from '@/components/Pagination/Pagination';
import { ProductType } from './api/types';

const Products: React.FC = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [tab, setTab] = useState('draft');
  const [search, setSearch] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const { data: products, isLoading } = useQuery({
    queryKey: ['getUserStoresProductsList', storeKey, tab, page, limit, search],
    queryFn: () =>
      getUserStoresProductsList({
        Status: tab,
        Page: page,
        Limit: limit,
        Search: search,
      }),
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <Tabs
          onValueChange={(val) => {
            setTab(val);
            setPage(1);
          }}
          defaultValue={tab}
          className="w-full md:w-auto"
        >
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-[300px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading && <LoaderMain />}

      {!isLoading && !products?.Data?.length && (
        <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <Package2 className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No products found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {search
                ? "We couldn't find any products matching your search."
                : "You haven't added any products yet. Add your first product to get started."}
            </p>
            <Button>
              <Link
                className="flex items-center"
                to="/store/$storeKey/products/create"
                params={{ storeKey }}
              >
                <Plus className="mr-2" /> Add Product
              </Link>
            </Button>
          </div>
        </div>
      )}

      {!isLoading && products?.Data && products.Data.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              {selectedProducts.length > 0 && (
                <>
                  <p className="text-sm text-muted-foreground">
                    {selectedProducts.length} selected
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Bulk Actions <MoreHorizontal className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Update Status</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete Selected
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
            <Button variant="defaultGradiant">
              <Link
                className="flex items-center"
                to="/store/$storeKey/products/create"
                params={{ storeKey }}
              >
                <Plus className="mr-2" /> Create Product
              </Link>
            </Button>
          </div>

          <DataTable columns={productsColumn} data={products.Data} />
        </>
      )}

      {products?.Pagination && (
        <div className="mt-4">
          <PaginationMain
            PaginationDetails={products.Pagination}
            setPage={setPage}
          />
        </div>
      )}
    </section>
  );
};

export default Products;
