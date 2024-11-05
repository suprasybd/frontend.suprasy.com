import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/index';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import React from 'react';
import {
  formatDate,
  formatDateToMinutes,
} from '../../../libs/helpers/formatdate';
import { AreaType } from '../api';
import DeleteAreaModal from './DeleteAreaModal';
import { useShippingStore } from './shippingStore';

export const areasColumns: ColumnDef<AreaType>[] = [
  {
    accessorKey: 'Area',
    header: 'Zone/Area Name',
  },
  {
    accessorKey: 'Cost',
    header: 'Cost (BDT/৳)',
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
              <UpdateWrapper areaId={area.Id} />
              <DropdownMenuItem
                onClick={(e) => e.preventDefault()}
                className="hover:!bg-red-500 hover:!text-white"
              >
                <DeleteAreaModal areaId={area.Id} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

const UpdateWrapper: React.FC<{ areaId: number }> = ({ areaId }) => {
  const { setShippingModalParams, toggleModal } = useShippingStore(
    (state) => state
  );
  return (
    <DropdownMenuItem
      onClick={(e) => {
        e.preventDefault();
        setShippingModalParams({ update: true, areaId: areaId });
        toggleModal();
      }}
      className="  hover:cursor-pointer"
    >
      Update Area
    </DropdownMenuItem>
  );
};
