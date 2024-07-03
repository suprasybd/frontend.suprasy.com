import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import React, { useMemo } from 'react';
import { getOrderById, getOrderProductsById } from '../api';
import { formatPrice } from '@customer/libs/helpers/formatdate';
import {
  getProductsDetails,
  getProductsImages,
} from '@customer/pages/products/api';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@customer/components/index';

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
        total += product.Price;
      }
      return total;
    }
    return total;
  }, [orderProducts, order]);

  const totalProductCost = useMemo(() => {
    let total = 0;
    if (orderProducts && order && orderProducts.length) {
      for (const product of orderProducts) {
        total += product.Price;
      }
      return total;
    }
    return total;
  }, [orderProducts, order]);

  return (
    <section className="w-full min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      {/* contact info */}
      <h1 className="font-bold my-5">Contact Information</h1>
      <div className="flex gap-[100px] flex-wrap w-full">
        <div>
          <h1 className="text-sm font-medium">Full Name</h1>
          <h1>{order?.FullName}</h1>
        </div>

        <div>
          <h1 className="text-sm font-medium">Phone</h1>
          <h1>{order?.Phone}</h1>
        </div>

        <div>
          <h1 className="text-sm font-medium">Email</h1>
          <h1>{order?.Email}</h1>
        </div>
      </div>

      {/* address info */}
      <h1 className="font-bold my-5">Shipping Information</h1>
      <div className="flex gap-[100px] flex-wrap w-full">
        <div>
          <h1 className="text-sm font-medium">Address</h1>
          <h1>{order?.Address}</h1>
        </div>

        <div>
          <h1 className="text-sm font-medium">Delivery Method </h1>
          <h1>{order?.DeliveryMethod}</h1>
          {formatPrice(order?.DeliveryMethodPrice || 0)}
        </div>

        <div>
          <h1 className="text-sm font-medium">Shipping Method </h1>
          <h1>{order?.ShippingMethod} </h1>
          {formatPrice(order?.ShippingMethodPrice || 0)}
        </div>
      </div>
      <h1 className="font-bold my-5">Other</h1>
      <div className="flex gap-[100px] flex-wrap w-full">
        <div>
          <h1 className="text-sm font-medium">Status </h1>
          <h1>{order?.Status} </h1>
        </div>

        {order?.Note && (
          <div>
            <h1 className="text-sm font-medium">Note </h1>
            <h1>{order?.Note} </h1>
          </div>
        )}
      </div>

      {/* products list */}
      <h1 className="font-bold my-5">Products Ordered Listed Bellow</h1>

      {orderProducts?.map((product) => (
        <div className="p-4 border border-gray-400 rounded-md my-3">
          <ProductDetails ProductId={product.ProductId} />
          <div className="flex gap-[100px] flex-wrap w-full">
            <div>
              <h1 className="text-sm font-medium">Quantity </h1>
              <h1>{product?.Quantity} </h1>
            </div>

            {product?.ProductAttribute && (
              <div>
                <h1 className="text-sm font-medium">Variant </h1>
                <h1>{product?.ProductAttribute} </h1>
              </div>
            )}
            <div>
              <h1 className="text-sm font-medium"> Price</h1>
              <h1>{formatPrice(product?.Price)} </h1>
            </div>

            <div>
              <h1 className="text-sm font-medium">Total Price</h1>
              <h1>{formatPrice(product?.Price * product.Quantity)} </h1>
            </div>
          </div>
        </div>
      ))}

      {/* total cost */}
      <div>
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex  font-medium text-3xl justify-between w-full">
                <h1 className=" my-5">Cost Breakdown</h1>
                <h1>Total Cost: {formatPrice(totalCost || 0)}</h1>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              Breakdown Is Bellow
              <div className="my-3">
                <h1 className="text-sm font-medium"> Shipping Cost</h1>
                <h1>{formatPrice(order?.ShippingMethodPrice || 0)} </h1>
              </div>
              <div className="my-3">
                <h1 className="text-sm font-medium"> Delivery Cost</h1>
                <h1>{formatPrice(order?.DeliveryMethodPrice || 0)} </h1>
              </div>
              <div className="my-3">
                <h1 className="text-sm font-medium"> Total Product Cost</h1>
                <h1>{formatPrice(totalProductCost || 0)} </h1>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

const ProductDetails: React.FC<{ ProductId: number }> = ({ ProductId }) => {
  const { data: productDetailsResponse } = useQuery({
    queryKey: ['getProductDetailsOrderDPage', ProductId],
    queryFn: () => getProductsDetails(ProductId || 0),
    enabled: !!ProductId,
  });
  const { data: productImagesResponse } = useQuery({
    queryKey: ['getProductImagesOrderDPage', ProductId],
    queryFn: () => getProductsImages(ProductId || 0),
    enabled: !!ProductId,
  });

  const productDetails = productDetailsResponse?.Data;
  const productImages = productImagesResponse?.Data;

  return (
    <div className="my-3">
      {productImages && (
        <img
          src={productImages[0].ImageUrl}
          width={'100px'}
          className="rounded-md"
          height={'100px'}
          alt="product"
        />
      )}
      <div className="flex gap-[100px] flex-wrap w-full">
        <div>
          <h1 className="text-sm font-medium mt-3">Title </h1>
          <h1>{productDetails?.Title} </h1>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
