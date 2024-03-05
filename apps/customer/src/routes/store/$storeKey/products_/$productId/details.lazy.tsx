import { createLazyFileRoute } from '@tanstack/react-router';
import ProductDetails from '../../../../../pages/products/details/ProductDetails';

export const Route = createLazyFileRoute(
  '/store/$storeKey/products/$productId/details'
)({
  component: () => <ProductDetails />,
});
