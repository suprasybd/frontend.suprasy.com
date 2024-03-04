import { createFileRoute } from '@tanstack/react-router';
import CreateProduct from '../../../../pages/products/create/CreateProduct';
interface ProductSearchTypes {
  update?: boolean;
  productId?: number;
  uuid?: string;
}

export const Route = createFileRoute('/store/$storeKey/products/create')({
  component: () => <CreateProduct />,
  validateSearch: (search: Record<string, unknown>): ProductSearchTypes => {
    return {
      update: Boolean(search?.update ?? false),
      productId: Number(search?.productId),
      uuid: String(search?.uuid || ''),
    };
  },
});
