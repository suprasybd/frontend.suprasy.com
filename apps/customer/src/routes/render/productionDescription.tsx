import ProductDescription from '@customer/pages/render/ProductDescription/ProductDescription';
import { createFileRoute } from '@tanstack/react-router';

interface ProductSearchTypes {
  storeKey?: string;
  productId?: number;
  summary?: boolean;
}

export const Route = createFileRoute('/render/productionDescription')({
  component: () => <ProductDescription />,
  validateSearch: (search: Record<string, unknown>): ProductSearchTypes => {
    return {
      productId: Number(search?.productId),
      storeKey: String(search?.storeKey || ''),
      summary: Boolean(search?.summary ?? false),
    };
  },
});
