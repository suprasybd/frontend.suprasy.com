import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import React from 'react';
import { getProductsDetails, getProductsImages } from '../api';

import { RichTextRender } from '@frontend.suprasy.com/ui';

const ProductDetails: React.FC = () => {
  const { storeKey, productId } = useParams({ strict: false }) as {
    storeKey: string;
    productId: string;
  };

  // @Api - @Data Fetching

  const { data: productDetailsResponse } = useQuery({
    queryKey: ['getProductDetails', productId],
    queryFn: () => getProductsDetails(parseInt(productId, 10) || 0),

    enabled: !!productId,
  });

  const { data: productImagesResponse } = useQuery({
    queryKey: ['getProductImages', productId],
    queryFn: () => getProductsImages(parseInt(productId, 10) || 0),
    enabled: !!productId,
  });

  const productDetails = productDetailsResponse?.Data;
  const productImages = productImagesResponse?.Data;

  return (
    <section className="w-full max-w-[54rem] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <div>
        <span className="font-bold ">Title</span>
        <h1 className="text-2xl">{productDetails?.Title}</h1>
      </div>

      <div className="mt-7">
        <span className="font-bold ">Slug</span>
        <h1 className="text-sm">{productDetails?.Slug}</h1>
      </div>

      <div className="mt-7">
        <span className="font-bold ">Description</span>
        {productDetails?.Description && (
          <RichTextRender initialVal={productDetails?.Description} />
        )}
      </div>

      <div className="mt-7">
        <span className="font-bold ">Images</span>
        {productImages?.map((image) => (
          <div>
            <img src={image.ImageUrl} alt="Proudct" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductDetails;
