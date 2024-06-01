import { ColumnDef } from '@tanstack/react-table';

import { MoreHorizontal } from 'lucide-react';

import { Button } from '@customer/components/index';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@customer/components/index';

import { Link } from '@tanstack/react-router';
import { v4 as uuidv4 } from 'uuid';
import { OrderType } from './api';
import { useModalStore } from '@customer/store/modalStore';

export const ordersColumn: ColumnDef<OrderType>[] = [
  {
    accessorKey: 'Id',
    header: 'Id',
  },
  {
    accessorKey: 'Email',
    header: 'Email',
  },
  {
    accessorKey: 'FirstName',
    header: 'First Name',
  },
  {
    accessorKey: 'LastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'Phone',
    header: 'Phone',
  },
  {
    accessorKey: 'Email',
    header: 'Email',
  },
  {
    accessorKey: 'ShippingMethod',
    header: 'Shipping',
    cell: ({ row }) => {
      return (
        <p className="">{row.original.ShippingMethod.slice(0, 30) + '...'}</p>
      );
    },
  },
  {
    accessorKey: 'Status',
    header: 'Status',
  },
  {
    accessorKey: 'CreatedAt',
    header: 'Order Time',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const order = row.original;

      return (
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
            <DropdownMenuItem>
              <Link
                to="/store/$storeKey/orders/$orderId"
                params={{
                  orderId: order.Id?.toString(),
                  storeKey: order.StoreKey,
                }}
              >
                View order details
              </Link>
            </DropdownMenuItem>
            <UpdateOrder OrderId={order.Id} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const UpdateOrder: React.FC<{ OrderId: number }> = ({ OrderId }) => {
  const { setModalPath } = useModalStore((state) => state);
  return (
    <div>
      <DropdownMenuItem
        className="cursor-pointer"
        onClick={() => {
          setModalPath({ modal: 'update-order', OrderId });
        }}
      >
        Update Order
      </DropdownMenuItem>
    </div>
  );
};
