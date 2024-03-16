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
      const product = row.original;

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
              <DropdownMenuItem
                onClick={(e) => e.preventDefault()}
                className="hover:!bg-red-500 hover:!text-white"
              >
                <DeleteProductModal productId={product.Id} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
