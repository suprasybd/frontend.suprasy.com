import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getInventoryList } from './api';

const Inventory: React.FC = () => {
  const { data: inventoryListResponse } = useQuery({
    queryKey: ['getInventoryList'],
    queryFn: getInventoryList,
  });

  const inventoryList = inventoryListResponse?.Data;

  console.log(inventoryList);

  return (
    <section className="w-full max-w-[54rem] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      asfdasdf
    </section>
  );
};

export default Inventory;
