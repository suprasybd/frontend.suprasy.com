import { Button } from '@frontend.suprasy.com/ui';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import { Plus, ShoppingCart } from 'lucide-react';
import React from 'react';
import { LoaderMain } from '../../components/Loader/Loader';
import { getUserStoresProductsList } from './api';
import { productsColumn } from './table/columns';
import { DataTable } from '../../components/Table/table';

const Products: React.FC = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };
  const { data: products, isLoading } = useQuery({
    queryKey: ['getUserStoresProductsList', storeKey],
    queryFn: getUserStoresProductsList,
  });

  return (
    <section className="w-full max-w-[94rem] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
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
        <div className="flex justify-center py-5 ">
          <div className="flex flex-col items-center">
            <ShoppingCart size={'60px'} strokeWidth={'1px'} />
            <h3 className="font-bold">No products</h3>
            <p>Get started by creating a new project.</p>
            <Button className="mt-3" variant={'defaultGradiant'}>
              <Link
                className="flex items-center justify-center"
                to="/store/$storeKey/products/create"
                params={{ storeKey }}
              >
                <Plus className="mr-2" /> Create Product
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
