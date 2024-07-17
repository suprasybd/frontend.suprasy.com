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
    <div>
      {/* prodcuts for categories */}
      {categories && categories.length > 0 && (
        <Tabs
          defaultValue={categories && categories[0].Id.toString()}
          className="w-full"
        >
          <TabsList>
            {categories?.map((category) => (
              <TabsTrigger value={category.Id.toString()}>
                {category.Name}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories?.map((category) => (
            <TabsContent value={category.Id.toString()}>
              <ProductTable category={category} />
            </TabsContent>
          ))}
        </Tabs>
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
    <div>
      {!isLoading && products?.Data && products?.Data?.length > 0 && (
        <DataTable
          columns={productsColumnCategories}
          data={products?.Data || []}
        />
      )}

      {products?.Pagination && (
        <PaginationMain
          PaginationDetails={products?.Pagination}
          setPage={setPage}
        />
      )}
    </div>
  );
};

export default ProductCategories;
