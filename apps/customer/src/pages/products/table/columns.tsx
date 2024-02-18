import { ColumnDef } from '@tanstack/react-table';
import { ProductType } from '../api/types';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@frontend.suprasy.com/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@frontend.suprasy.com/ui';
import { Link, useParams } from '@tanstack/react-router';

export const productsColumn: ColumnDef<ProductType>[] = [
  {
    accessorKey: 'Id',
    header: 'Id',
  },
  {
    accessorKey: 'Title',
    header: 'Title',
  },
  {
    accessorKey: 'Slug',
    header: 'Slug',
  },
  {
    accessorKey: 'Description',
    header: 'Description',
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original;

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText('asd')}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                to="/store/$storeKey/products/$productId/details"
                params={{
                  productId: product.Id?.toString(),
                  storeKey: product.StoreKey,
                }}
              >
                View product details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
