import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getProductsImages, getVariations } from '../../api';
import { useParams } from '@tanstack/react-router';
import { LoaderMain } from '../../../../components/Loader/Loader';

const ProductImagesList: React.FC = () => {
  const { productId } = useParams({ strict: false }) as {
    storeKey: string;
    productId: string;
  };

  // First fetch variations
  const { data: variationsResponse, isLoading: isLoadingVariations } = useQuery(
    {
      queryKey: ['getProductVariations', productId],
      queryFn: () => getVariations(parseInt(productId) || 0),
      enabled: !!productId,
    }
  );

  // Then fetch images using the first variation's ID
  const firstVariationId = variationsResponse?.Data?.[0]?.Id;
  const { data: productImagesResponse, isLoading: isLoadingImages } = useQuery({
    queryKey: ['getProductImages', firstVariationId],
    queryFn: () => getProductsImages(firstVariationId!),
    enabled: !!firstVariationId,
  });

  const productImages = productImagesResponse?.Data;
  const isLoading = isLoadingVariations || isLoadingImages;

  return (
    <div>
      {isLoading && <LoaderMain />}

      {!isLoading && (
        <div className="mt-7">
          <span className="text-lg font-bold my-3 ">Images</span>
          {productImages?.map((image) => (
            <div>
              <img src={image.ImageUrl} alt="Product" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImagesList;
