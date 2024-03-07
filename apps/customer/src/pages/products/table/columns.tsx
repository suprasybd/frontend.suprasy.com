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
import { Link } from '@tanstack/react-router';
import { v4 as uuidv4 } from 'uuid';

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
    cell: ({ row }) => {
      const product = row.original;

      return product.Description.slice(0, 50) + '...';
    },
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

            <DropdownMenuSeparator />
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
            <DropdownMenuItem>
              <Link
                to="/store/$storeKey/products/create"
                params={{
                  storeKey: product.StoreKey,
                }}
                search={{
                  productId: product.Id,
                  update: true,
                  uuid: uuidv4(),
                }}
              >
                Update Product
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Link
                to="/store/$storeKey/products/create"
                params={{
                  storeKey: product.StoreKey,
                }}
                search={{
                  updateInventory: true,
                  productId: product.Id,
                  update: true,
                  uuid: uuidv4(),
                }}
                hash="inventory"
              >
                Update Inventory
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
