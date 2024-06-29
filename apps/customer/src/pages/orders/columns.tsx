import { ColumnDef } from '@tanstack/react-table';

import { MoreHorizontal } from 'lucide-react';

import { Button } from '@customer/components/index';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Badge,
  DropdownMenuTrigger,
} from '@customer/components/index';

import { Link, useParams } from '@tanstack/react-router';
import { v4 as uuidv4 } from 'uuid';
import { OrderType } from './api';
import { useModalStore } from '@customer/store/modalStore';

export const ordersColumn: ColumnDef<OrderType>[] = [
  {
    accessorKey: 'Id',
    header: 'Id',
  },
  {
    id: 'contact',
    header: 'Contact',
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div>
          <p>
            {order.FirstName} {order.LastName}
          </p>
          <p>{order.Phone}</p>
          <p>{order.Email}</p>
        </div>
      );
    },
  },

  {
    accessorKey: 'ShippingMethod',
    header: 'Shipping',
    cell: ({ row }) => {
      return (
        <div>
          <p className="">{row.original.ShippingMethod.slice(0, 30) + '...'}</p>
          {Boolean(row.original.Note) && <p>Note: {row.original.Note}</p>}
        </div>
      );
    },
  },
  {
    accessorKey: 'Status',
    header: 'Status',
    cell: ({ row }) => {
      return <Badge variant="secondary">{row.original.Status}</Badge>;
    },
  },
  {
    accessorKey: 'CreatedAt',
    header: 'Order Time',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const order = row.original;

      return <ActionComponent order={order} />;
    },
  },
];

const ActionComponent: React.FC<{ order: OrderType }> = ({ order }) => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };
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
              storeKey,
            }}
          >
            View order details
          </Link>
        </DropdownMenuItem>
        <UpdateOrder OrderId={order.Id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

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
