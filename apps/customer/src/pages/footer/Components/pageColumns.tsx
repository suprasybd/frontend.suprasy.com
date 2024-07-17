import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
} from '@customer/components/index';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import {
  formatDate,
  formatDateToMinutes,
} from '../../../libs/helpers/formatdate';
import { Page } from '../api';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@customer/components';
import { useParams } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';

export const pageColumns: ColumnDef<Page>[] = [
  {
    accessorKey: 'Url',
    header: 'Url',
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
      const page = row.original;
      return <ActionComponent page={page} />;
    },
  },
];

const ActionComponent: React.FC<{ page: Page }> = ({ page }) => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };
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
            to="/store/$storeKey/footer/createpage"
            search={{ update: true, pageId: page.Id }}
            params={{
              storeKey,
            }}
          >
            Update Page
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
