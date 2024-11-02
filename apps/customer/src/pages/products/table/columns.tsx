import { ColumnDef } from '@tanstack/react-table';
import { ProductType } from '../api/types';
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
import DeleteProductModal from './components/DeleteProductModal';
import { Link, useParams } from '@tanstack/react-router';
import { v4 as uuidv4 } from 'uuid';
import {
  formatDate,
  formatDateToMinutes,
} from '../../../../src/libs/helpers/formatdate';
import { useModalStore } from '@customer/store/modalStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductsImages } from '../api';
import { Badge } from '@customer/components/index';
import { Eye, Edit, CircleIcon, Copy, FolderEdit } from 'lucide-react';
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@customer/components/index';
import { updateStoresProduct } from '../api';
import { useToast } from '@customer/components/index';

export const productsColumn: ColumnDef<ProductType>[] = [
  {
    cell: ({ row }) => {
      const product = row.original;

      return <ProductImage product={product} />;
    },
    id: 'img',
  },
  {
    accessorKey: 'Title',
    header: 'Title',
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{product.Title}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'Slug',
    header: 'Slug',
  },
  {
    accessorKey: 'Status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.Status?.toLowerCase();
      return (
        <Badge
          variant={
            status === 'active'
              ? 'default'
              : status === 'draft'
              ? 'secondary'
              : 'destructive'
          }
        >
          {row.original.Status}
        </Badge>
      );
    },
  },

  {
    accessorKey: 'UpdatedAt',
    header: 'UpdatedAt',
    cell: ({ row }) => {
      const product = row.original;

      return formatDateToMinutes(product.UpdatedAt);
    },
  },
  {
    accessorKey: 'CreatedAt',
    header: 'Created At',
    cell: ({ row }) => {
      const product = row.original;

      return formatDateToMinutes(product.CreatedAt);
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const product = row.original;

      return <ActionComponent product={product} />;
    },
  },
];

const ProductImage: React.FC<{ product: ProductType }> = ({ product }) => {
  const { storeKey } = useParams({ strict: false }) as {
    storeKey: string;
  };
  const { data: productImages } = useQuery({
    queryKey: ['getProductImagesinTable', product.Id, storeKey],
    queryFn: () => getProductsImages(product.Id),
    enabled: !!product.Id && !!storeKey,
  });
  return (
    <div className="ml-5 !w-[100px]">
      {productImages?.Data[0]?.ImageUrl && (
        <img
          className="rounded-md h-[100px] w-[100px]"
          alt="product"
          height={'100px'}
          width={'100px'}
          src={productImages?.Data[0].ImageUrl}
        />
      )}
    </div>
  );
};

const ActionComponent: React.FC<{ product: ProductType }> = ({ product }) => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* View Details */}
        <DropdownMenuItem>
          <Link
            to="/store/$storeKey/products/$productId/details"
            params={{
              productId: product.Id?.toString(),
              storeKey,
            }}
            className="flex w-full items-center"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </DropdownMenuItem>

        {/* Update Product */}
        <DropdownMenuItem>
          <Link
            to="/store/$storeKey/products/create"
            params={{ storeKey }}
            search={{
              productId: product.Id,
              update: true,
              uuid: uuidv4(),
            }}
            className="flex w-full items-center"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </Link>
        </DropdownMenuItem>

        {/* Update Category */}
        <UpdateWrapper productId={product.Id} />

        <DropdownMenuSeparator />

        {/* Delete */}
        <DropdownMenuItem
          onClick={(e) => e.preventDefault()}
          className="text-red-600 hover:!bg-red-50 hover:!text-red-700"
        >
          <DeleteProductModal productId={product.Id} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const UpdateWrapper: React.FC<{ productId: number }> = ({ productId }) => {
  const { setModalPath } = useModalStore((state) => state);
  return (
    <DropdownMenuItem
      onClick={(e) => {
        e.preventDefault();
        setModalPath({ modal: 'update-category-product', productId });
      }}
      className="hover:cursor-pointer"
    >
      <FolderEdit className="mr-2 h-4 w-4" />
      Update Category
    </DropdownMenuItem>
  );
};
