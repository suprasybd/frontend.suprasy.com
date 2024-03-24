import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@frontend.suprasy.com/ui';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import React from 'react';
import { formatDate } from '../../../../libs/helpers/formatdate';
import { ShippingMethodType } from '../../api';
import DeleteAreaModal from './DeleteMethodModal';
import { useShippingStoreMethod } from './shippingStore';

export const areasColumns: ColumnDef<ShippingMethodType>[] = [
  {
    accessorKey: 'Id',
    header: 'Id',
  },
  {
    accessorKey: 'DeliveryMethod',
    header: 'Delivery Method',
  },
  {
    accessorKey: 'Cost',
    header: 'Cost (BDT/৳)',
  },
  {
    accessorKey: 'CreatedAt',
    header: 'Created At',
    cell: ({ row }) => {
      return formatDate(row.original.CreatedAt);
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const area = row.original;

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
              <UpdateWrapper methodId={area.Id} />
              <DropdownMenuItem
                onClick={(e) => e.preventDefault()}
                className="hover:!bg-red-500 hover:!text-white"
              >
                <DeleteAreaModal methodId={area.Id} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

const UpdateWrapper: React.FC<{ methodId: number }> = ({ methodId }) => {
  const { setShippingModalParams, toggleModal } = useShippingStoreMethod(
    (state) => state
  );
  return (
    <DropdownMenuItem
      onClick={(e) => {
        e.preventDefault();
        setShippingModalParams({ update: true, methodId: methodId });
        toggleModal();
      }}
      className="  hover:cursor-pointer"
    >
      Update Delivery Method
    </DropdownMenuItem>
  );
};
