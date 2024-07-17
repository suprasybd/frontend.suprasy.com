import { ColumnDef } from '@tanstack/react-table';

import {
  BookUser,
  CircleUser,
  Globe,
  Mails,
  MoreHorizontal,
  PhoneCall,
} from 'lucide-react';

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
import { OrderType } from './api';
import { useModalStore } from '@customer/store/modalStore';
import {
  formatDate,
  formatDateToMinutes,
} from '@customer/libs/helpers/formatdate';

export const ordersColumn: ColumnDef<OrderType>[] = [
  {
    accessorKey: 'Id',
    header: 'Id',
  },
  {
    id: 'contact',
    header: 'Contact Information',
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="p-3 bg-slate-100 rounded-md w-fit">
          <p className="mb-2 font-bold flex gap-[5px] items-center">
            <CircleUser className="h-[16px] w-[16px]" />
            {order.FullName}
          </p>
          <p className="mb-2 font-bold flex gap-[5px] items-center">
            <PhoneCall className="h-[16px] w-[16px]" />
            {order.Phone}
          </p>
          <p className="mb-2 font-bold flex gap-[5px] items-center">
            <Mails className="h-[16px] w-[16px]" />
            {order.Email}
          </p>
        </div>
      );
    },
  },
  {
    id: 'address',
    header: 'Delivery Address',
    cell: ({ row }) => {
      const order = row.original;

      return (
        <p className="mb-2 font-bold flex gap-[5px] items-center">
          <BookUser className="h-[16px] w-[16px]" />
          {order.Address}
        </p>
      );
    },
  },
  {
    id: 'note',
    header: 'Note',
    cell: ({ row }) => {
      const order = row.original;

      return <p>{order.Note}</p>;
    },
  },
  {
    accessorKey: 'ShippingMethod',
    header: 'Shipping',
    cell: ({ row }) => {
      return (
        <div>
          <p className="">{row.original.ShippingMethod.slice(0, 30) + '...'}</p>
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
    cell: ({ row }) => {
      return formatDateToMinutes(row.original.CreatedAt);
    },
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
