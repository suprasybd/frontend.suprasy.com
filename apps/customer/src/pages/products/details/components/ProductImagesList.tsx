import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getProductsImages } from '../../api';
import { useParams } from '@tanstack/react-router';
import { LoaderMain } from '../../../../components/Loader/Loader';

const ProductImagesList: React.FC = () => {
  const { productId } = useParams({ strict: false }) as {
    storeKey: string;
    productId: string;
  };

  const { data: productImagesResponse, isLoading } = useQuery({
    queryKey: ['getProductImages', productId],
    queryFn: () => getProductsImages(parseInt(productId) || 0),
    enabled: !!productId,
  });
  const productImages = productImagesResponse?.Data;

  return (
    <div>
      {isLoading && <LoaderMain />}

      {!isLoading && (
        <div className="mt-7">
          <span className="text-lg font-bold my-3 ">Images</span>
          {productImages?.map((image) => (
            <div>
              <img src={image.ImageUrl} alt="Proudct" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImagesList;
