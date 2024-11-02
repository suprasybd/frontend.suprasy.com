import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@customer/components/index';
import { useQuery } from '@tanstack/react-query';
import { Category, getAllCategories } from './api';
import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { getUserStoresProductsList } from '../products/api';
import { DataTable } from '@customer/components/Table/table';
import { productsColumnCategories } from './table/columns';
import PaginationMain from '@customer/components/Pagination/Pagination';
import { activeFilters } from '@customer/libs/helpers/filters';

const ProductCategories = () => {
  const { data: categoryResponse } = useQuery({
    queryKey: ['getCategoriesAllCatPage'],
    queryFn: () => getAllCategories(),
  });

  const categories = categoryResponse?.Data;

  return (
    <div className="container mx-auto p-4">
      {/* products for categories */}
      {categories && categories.length > 0 ? (
        <Tabs defaultValue={categories[0].Id.toString()} className="w-full">
          <TabsList className="w-full flex overflow-x-auto tabs-list-scroll">
            {categories?.map((category) => (
              <TabsTrigger
                key={category.Id}
                value={category.Id.toString()}
                className="tabs-trigger whitespace-nowrap"
              >
                {category.Name}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories?.map((category) => (
            <TabsContent
              key={category.Id}
              value={category.Id.toString()}
              className="mt-6"
            >
              <ProductTable category={category} />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No categories found</p>
        </div>
      )}
    </div>
  );
};

const ProductTable: React.FC<{ category: Category }> = ({ category }) => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // { Status: tab, Page: page, Limit: limit }
  const { data: products, isLoading } = useQuery({
    queryKey: ['getUserStoresProductsList', storeKey, page, limit, category.Id],
    queryFn: () =>
      getUserStoresProductsList({
        ...activeFilters([
          { isActive: true, key: 'CategoryId', value: category.Id.toString() },
        ]),
        Status: 'active',
        Page: page,
        Limit: limit,
      }),
    enabled: !!storeKey,
  });

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="w-full h-32 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : products?.Data && products.Data.length > 0 ? (
        <>
          <DataTable columns={productsColumnCategories} data={products.Data} />
          {products.Pagination && (
            <div className="mt-4">
              <PaginationMain
                PaginationDetails={products.Pagination}
                setPage={setPage}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 bg-muted/10 rounded-lg">
          <p className="text-muted-foreground">
            No products found in this category
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCategories;
