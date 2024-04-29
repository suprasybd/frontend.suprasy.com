import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import React from 'react';
import { getOrderById, getOrderProductsById } from '../api';
import { formatPrice } from '@customer/libs/helpers/formatdate';
import {
  getProductsDetails,
  getProductsImages,
} from '@customer/pages/products/api';

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

  return (
    <section className="w-full min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      {/* contact info */}
      <h1 className="font-bold my-5">Contact Information</h1>
      <div className="flex gap-[100px] flex-wrap w-full">
        <div>
          <h1 className="text-sm font-medium">First Name</h1>
          <h1>{order?.FirstName}</h1>
        </div>

        <div>
          <h1 className="text-sm font-medium">Last Name</h1>
          <h1>{order?.LastName}</h1>
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
          <h1>
            {order?.DeliveryMethod} -{' '}
            {formatPrice(order?.DeliveryMethodPrice || 0)}
          </h1>
        </div>

        <div>
          <h1 className="text-sm font-medium">Shipping Method </h1>
          <h1>
            {order?.ShippingMethod} -{' '}
            {formatPrice(order?.ShippingMethodPrice || 0)}
          </h1>
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

      <h1 className="font-bold my-5">Products Ordered Listed Bellow</h1>

      {orderProducts?.map((product) => (
        <div className="p-4 border border-gray-400 rounded-md">
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
    </section>
  );
};

const ProductDetails: React.FC<{ ProductId: number }> = ({ ProductId }) => {
  const { data: productDetailsResponse } = useQuery({
    queryKey: ['getProductDetailsOrderDPage'],
    queryFn: () => getProductsDetails(ProductId || 0),
    enabled: !!ProductId,
  });
  const { data: productImagesResponse } = useQuery({
    queryKey: ['getProductImagesOrderDPage'],
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
          height={'100px'}
          alt="product"
        />
      )}
      <div className="flex gap-[100px] flex-wrap w-full">
        <div>
          <h1 className="text-sm font-medium">Title </h1>
          <h1>{productDetails?.Title} </h1>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
