import React from 'react';

import { Button } from '@customer/components';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';

import { getAllPage } from '../api';
import { pageColumns } from './pageColumns';
import { DataTable } from '@customer/components/Table/table';
import { LoaderMain } from '@customer/components/Loader/Loader';

const Page = () => {
  const { storeKey } = useParams({ strict: false }) as {
    storeKey: string;
  };

  const { data: pageResponse, isLoading } = useQuery({
    queryKey: ['getPagesAll'],
    queryFn: getAllPage,
  });

  const page = pageResponse?.Data;

  return (
    <div>
      <div className="flex w-full justify-end mb-5">
        <Button>
          <Link to="/store/$storeKey/footer/createpage" params={{ storeKey }}>
            Add Page
          </Link>
        </Button>
      </div>

      {isLoading && <LoaderMain />}

      {!isLoading && page && page?.length === 0 && <p>Not pages found!</p>}

      {!isLoading && page && page?.length > 0 && (
        <DataTable columns={pageColumns} data={page || []} />
      )}
    </div>
  );
};

export default Page;
