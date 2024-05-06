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
            <DropdownMenuItem>
              <Link
                to="/store/$storeKey/products/create"
                params={{
                  storeKey: order.StoreKey,
                }}
                search={{
                  productId: order.Id,
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
                  storeKey: order.StoreKey,
                }}
                search={{
                  updateInventory: true,
                  productId: order.Id,
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
            ></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
