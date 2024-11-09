import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getPaymentsList } from '../../api';
import { LoaderMain } from '../../../../components/Loader/Loader';
import { DataTable } from '../../../../components/Table/table';
import { paymentColumns } from './columns';
import AddPayment from './AddPayment';

const PaymentMethod: React.FC = () => {
  const { data: paymentDataResponse, isLoading } = useQuery({
    queryKey: ['getStorePaymentsList'],
    queryFn: () => getPaymentsList(),
  });

  const paymentsData = paymentDataResponse?.Data;

  return (
    <div className="my-5 w-full">
      <div className="flex w-full justify-end mb-5">
        <AddPayment />
      </div>

      {isLoading && <LoaderMain />}

      {!isLoading && paymentsData?.length && (
        <DataTable columns={paymentColumns} data={paymentsData || []} />
      )}
    </div>
  );
};

export default PaymentMethod;
