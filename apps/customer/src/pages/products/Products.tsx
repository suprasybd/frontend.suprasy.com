import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getUserStoresProductsList } from './api';
import { DataTable } from './table/table';
import { productsColumn } from './table/columns';
import { ProductType } from './api/types';
import { Button } from '@frontend.suprasy.com/ui';
import { Plus, ShoppingCart } from 'lucide-react';
import { LoaderMain } from '../../components/Loader/Loader';
import { useParams } from '@tanstack/react-router';

const Products: React.FC = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };
  const { data: products, isLoading } = useQuery({
    queryKey: ['getUserStoresProductsList', storeKey],
    queryFn: getUserStoresProductsList,
  });
  console.log(products);
  return (
    <section className="w-full max-w-[94rem] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      {isLoading && <LoaderMain />}
      {!isLoading && !products?.Data?.length && (
        <div className="flex justify-center py-5">
          <div className="flex flex-col items-center">
            <ShoppingCart size={'60px'} strokeWidth={'1px'} />
            <h3 className="font-bold">No products</h3>
            <p>Get started by creating a new project.</p>
            <Button className="mt-3" variant={'defaultGradiant'}>
              <Plus className="mr-2" /> Create Product
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
