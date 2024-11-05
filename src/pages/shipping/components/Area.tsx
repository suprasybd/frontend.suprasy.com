import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getAreasList } from '../api';
import { LoaderMain } from '../../../components/Loader/Loader';
import { DataTable } from '../../../components/Table/table';
import { areasColumns } from './columns';
import AddArea from './AddArea';

const Area: React.FC = () => {
  const { data: areasDataResponse, isLoading } = useQuery({
    queryKey: ['getStoreAreasZones'],
    queryFn: () => getAreasList(),
  });

  const areasData = areasDataResponse?.Data;

  return (
    <div className="my-5 w-full">
      <div className="flex w-full justify-end mb-5">
        <AddArea />
      </div>

      {isLoading && <LoaderMain />}

      {!isLoading && areasData?.length && (
        <DataTable columns={areasColumns} data={areasData || []} />
      )}
    </div>
  );
};

export default Area;
