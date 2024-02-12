import { ColumnDef } from '@tanstack/react-table';
import { ProductType } from '../api/types';

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
    accessorKey: 'Price',
    header: 'Price',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('Price'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'BDT',
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'Type',
    header: 'Type',
  },
];
