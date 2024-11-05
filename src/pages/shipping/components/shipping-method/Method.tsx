import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getMethodsList } from '../../api';
import { LoaderMain } from '../../../../components/Loader/Loader';
import { DataTable } from '../../../../components/Table/table';
import { areasColumns } from './columns';
import AddMethod from './AddMethod';

const ShippingMethod: React.FC = () => {
  const { data: methodDataResponse, isLoading } = useQuery({
    queryKey: ['getStoreShipingMethodsList'],
    queryFn: () => getMethodsList(),
  });

  const methodsData = methodDataResponse?.Data;

  return (
    <div className="my-5 w-full">
      <div className="flex w-full justify-end mb-5">
        <AddMethod />
      </div>

      {isLoading && <LoaderMain />}

      {!isLoading && methodsData?.length && (
        <DataTable columns={areasColumns} data={methodsData || []} />
      )}
    </div>
  );
};

export default ShippingMethod;
