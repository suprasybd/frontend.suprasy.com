import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import React, { useMemo } from 'react';
import { getOrderById, getOrderProductsById } from '../api';
import { formatPrice } from '@/libs/helpers/formatdate';
import {
  getProductsDetails,
  getProductsImages,
  getVariationDetails,
} from '@/pages/products/api';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
} from '@/components/index';

const OrderDetails = () => {
  const { orderId } = useParams({ strict: false }) as {
    storeKey: string;
    orderId: string;
  };

  const { data: orderResponse } = useQuery({
    queryKey: ['getOrderById'],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });

  const { data: orderProductsResponse } = useQuery({
    queryKey: ['getOrderProducts'],
    queryFn: () => getOrderProductsById(orderId),
    enabled: !!orderId,
  });

  const order = orderResponse?.Data;
  const orderProducts = orderProductsResponse?.Data;

  const totalCost = useMemo(() => {
    let total = 0;
    if (orderProducts && order && orderProducts.length) {
      total += order.DeliveryMethodPrice;
      total += order.ShippingMethodPrice;
      for (const product of orderProducts) {
        total += product.Price * product.Quantity;
      }
      return total;
    }
    return total;
  }, [orderProducts, order]);

  const totalProductCost = useMemo(() => {
    let total = 0;
    if (orderProducts && order && orderProducts.length) {
      for (const product of orderProducts) {
        total += product.Price * product.Quantity;
      }
      return total;
    }
    return total;
  }, [orderProducts, order]);

  return (
    <section className="max-w-7xl w-full min-h-full mx-auto gap-6 py-8 px-4 sm:px-8">
      <div className="space-y-8">
        {/* Order Status Banner */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm text-gray-500">Order ID</h2>
              <p className="font-medium">#{orderId}</p>
            </div>
            <Badge className="px-4 py-1.5 text-sm capitalize">
              {order?.Status}
            </Badge>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm text-gray-500">Full Name</h3>
                <p className="font-medium">{order?.FullName}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Phone</h3>
                <p className="font-medium">{order?.Phone}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Email</h3>
                <p className="font-medium">{order?.Email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm text-gray-500">Address</h3>
                <p className="font-medium">{order?.Address}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Delivery Method</h3>
                <p className="font-medium">{order?.DeliveryMethod}</p>
                <p className="text-sm text-gray-500">
                  {formatPrice(order?.DeliveryMethodPrice || 0)}
                </p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Shipping Method</h3>
                <p className="font-medium">{order?.ShippingMethod}</p>
                <p className="text-sm text-gray-500">
                  {formatPrice(order?.ShippingMethodPrice || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Ordered Products</h2>
            <div className="space-y-4">
              {orderProducts?.map((product) => (
                <div
                  key={product.VariationId}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <ProductDetails VariationId={product.VariationId} />
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <h3 className="text-sm text-gray-500">Quantity</h3>
                      <p className="font-medium">{product?.Quantity}</p>
                    </div>
                    {product?.ProductAttribute && (
                      <div>
                        <h3 className="text-sm text-gray-500">Variant</h3>
                        <p className="font-medium">
                          {product?.ProductAttribute}
                        </p>
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm text-gray-500">Price</h3>
                      <p className="font-medium">
                        {formatPrice(product?.Price)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">Total Price</h3>
                      <p className="font-medium">
                        {formatPrice(product?.Price * product.Quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200">
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="px-6 py-4">
                <div className="flex justify-between w-full items-center">
                  <h2 className="text-lg font-semibold">Cost Breakdown</h2>
                  <p className="text-xl font-semibold">
                    {formatPrice(totalCost || 0)}
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping Cost</span>
                    <span className="font-medium">
                      {formatPrice(order?.ShippingMethodPrice || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivery Cost</span>
                    <span className="font-medium">
                      {formatPrice(order?.DeliveryMethodPrice || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Products Cost</span>
                    <span className="font-medium">
                      {formatPrice(totalProductCost || 0)}
                    </span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

const ProductDetails: React.FC<{ VariationId: number }> = ({ VariationId }) => {
  const { data: variationsDataResponse } = useQuery({
    queryKey: ['getVarination', VariationId],
    queryFn: () => getVariationDetails(VariationId || 0),
    enabled: !!VariationId,
  });

  const { data: productImagesResponse } = useQuery({
    queryKey: ['getProductImagesOrderDPage', VariationId],
    queryFn: () => getProductsImages(VariationId || 0),
    enabled: !!VariationId,
  });

  const productImages = productImagesResponse?.Data;
  const variationDetails = variationsDataResponse?.Data;

  const { data: productDetailsResponse } = useQuery({
    queryKey: ['getProductDetailsOrderDPage', variationDetails?.ProductId],
    queryFn: () => getProductsDetails(variationDetails?.ProductId || 0),
    enabled: !!variationDetails?.ProductId,
  });

  const productDetails = productDetailsResponse?.Data;

  return (
    <div className="flex items-center gap-6">
      {productImages && (
        <img
          src={productImages[0].ImageUrl}
          className="w-20 h-20 object-cover rounded-md"
          alt={productDetails?.Title || 'Product image'}
        />
      )}
      <div>
        <h3 className="font-medium">
          {productDetails?.Title}{' '}
          <span className="text-gray-500">
            ({variationDetails?.ChoiceName})
          </span>
        </h3>
        <p className="text-sm text-gray-500">
          Variation: {variationDetails?.ChoiceName}
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;
