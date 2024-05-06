import { Button } from '@customer/components/index';
import { Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { v4 as uuidv4 } from 'uuid';

export const inventoryDetailsColumn: ColumnDef<{
  Value: string;
  Inventory: number;
  Price: number;
  ProductId: number;
  StoreKey: string;
}>[] = [
  {
    accessorKey: 'ProductId',
    header: 'Product Id',
  },
  {
    accessorKey: 'Value',
    header: 'Variant / Name',
  },
  {
    accessorKey: 'Inventory',
    header: 'Inventory (Quantity)',
  },
  {
    accessorKey: 'Price',
    header: 'Price (BDT/৳)',
    cell: ({ row }) => {
      const inventory = row.original;

      return inventory.Price + ' (BDT/৳)';
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const inventory = row.original;

      return (
        <Button variant={'defaultGradiant'}>
          <Link
            to="/store/$storeKey/products/create"
            params={{
              storeKey: inventory.StoreKey,
            }}
            search={{
              updateInventory: true,
              productId: inventory.ProductId,
              update: true,
              uuid: uuidv4(),
            }}
            hash="inventory"
          >
            Update Inventory
          </Link>
        </Button>
      );
    },
  },
];
