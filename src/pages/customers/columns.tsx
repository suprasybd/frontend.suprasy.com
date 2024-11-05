import { ColumnDef } from '@tanstack/react-table';

import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/index';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Badge,
  DropdownMenuTrigger,
} from '@/components/index';

import { Link, useParams } from '@tanstack/react-router';
import { CustomerType } from './api';
import { useModalStore } from '@/store/modalStore';
import { formatDateToMinutes } from '@/libs/helpers/formatdate';

export const customersColumn: ColumnDef<CustomerType>[] = [
  {
    accessorKey: 'Id',
    header: 'Id',
  },

  {
    accessorKey: 'Email',
    header: 'Email',
  },
  {
    accessorKey: 'FullName',
    header: 'Full Name',
  },
  {
    accessorKey: 'IsVerified',
    header: 'Email Verification',
    cell: ({ row }) => {
      const isVerified = row.original.IsVerified;
      return (
        <Badge variant={isVerified ? 'default' : 'destructive'}>
          {isVerified ? 'Verified' : 'Not Verified'}
        </Badge>
      );
    },
  },

  {
    accessorKey: 'CreatedAt',
    header: 'Registration Time',
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

const ActionComponent: React.FC<{ order: CustomerType }> = ({ order }) => {
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
        {/* <DropdownMenuItem>
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
        <UpdateOrder OrderId={order.Id} /> */}
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
