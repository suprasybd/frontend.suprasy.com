import { ColumnDef } from '@tanstack/react-table';

import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/index';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/index';

import { Link, useParams } from '@tanstack/react-router';
import { v4 as uuidv4 } from 'uuid';
import {
  formatDate,
  formatDateToMinutes,
} from '../../../../src/libs/helpers/formatdate';
import { useModalStore } from '@/store/modalStore';
import { useQuery } from '@tanstack/react-query';
import { getProductsImages } from '@/pages/products/api';
import { ProductType } from '@/pages/products/api/types';

export const productsColumnCategories: ColumnDef<ProductType>[] = [
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
  },
  {
    accessorKey: 'Slug',
    header: 'Slug',
  },
  {
    accessorKey: 'Status',
    header: 'Status',
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
  const { setModalPath } = useModalStore((state) => state);

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
        <DropdownMenuItem
          onClick={() => {
            setModalPath({
              modal: 'update-category-product',
              productId: product.Id,
            });
          }}
        >
          Update Category
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// const UpdateWrapper: React.FC<{ productId: number }> = ({ productId }) => {
//   const { setModalPath } = useModalStore((state) => state);
//   return (
//     <DropdownMenuItem
//       onClick={(e) => {
//         e.preventDefault();
//         setModalPath({ modal: 'update-category-product', productId });
//       }}
//       className="  hover:cursor-pointer"
//     >
//       Update Category
//     </DropdownMenuItem>
//   );
// };
