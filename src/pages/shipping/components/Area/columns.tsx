import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { AreaType } from '../../api';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/index';
import { useShippingStore } from '../shippingStore';
import DeleteAreaModal from '../DeleteAreaModal';
import { formatDateToMinutes } from '@/libs/helpers/formatdate';

export const areasColumns: ColumnDef<AreaType>[] = [
  {
    accessorKey: 'Area',
    header: 'Area',
  },
  {
    accessorKey: 'Description',
    header: 'Description',
  },
  {
    accessorKey: 'Cost',
    header: 'Cost (BDT/৳)',
  },
  // ... rest of the columns remain the same
];
