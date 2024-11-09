import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { PaymentMethodType } from '../../api';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/index';
import { usePaymentStore } from './paymentStore';
import DeletePaymentModal from './DeletePaymentModal';
import { formatDateToMinutes } from '@/libs/helpers/formatdate';

export const paymentColumns: ColumnDef<PaymentMethodType>[] = [
  {
    accessorKey: 'PaymentMethod',
    header: 'Payment Method',
  },
  {
    accessorKey: 'Description',
    header: 'Description',
  },
  {
    accessorKey: 'CreatedAt',
    header: 'Created At',
    cell: ({ row }) => {
      return formatDateToMinutes(row.original.CreatedAt);
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <UpdateWrapper paymentId={payment.Id} />
              <DropdownMenuItem
                onClick={(e) => e.preventDefault()}
                className="hover:!bg-red-500 hover:!text-white"
              >
                <DeletePaymentModal paymentId={payment.Id} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

const UpdateWrapper: React.FC<{ paymentId: number }> = ({ paymentId }) => {
  const { setPaymentModalParams, toggleModal } = usePaymentStore(
    (state) => state
  );
  return (
    <DropdownMenuItem
      onClick={(e) => {
        e.preventDefault();
        setPaymentModalParams({ update: true, paymentId });
        toggleModal();
      }}
      className="hover:cursor-pointer"
    >
      Update Payment Method
    </DropdownMenuItem>
  );
};
