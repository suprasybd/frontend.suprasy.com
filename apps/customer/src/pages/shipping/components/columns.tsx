import { Button } from '@frontend.suprasy.com/ui';
import { Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { v4 as uuidv4 } from 'uuid';
import { AreaType } from '../api';
import { formatDate } from '../../../libs/helpers/formatdate';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@frontend.suprasy.com/ui';
import { MoreHorizontal } from 'lucide-react';
import DeleteProductModal from '../../products/table/components/DeleteProductModal';
import AddArea from './AddArea';
import { useShippingStore } from './shippingStore';
import React from 'react';
export const areasColumns: ColumnDef<AreaType>[] = [
  {
    accessorKey: 'Id',
    header: 'Zone Id',
  },
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
              <UpdateWrapper areaId={area.Id} />
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
