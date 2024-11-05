import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import React, { useEffect } from 'react';
import { getSFProductsDetailsById } from '../api';
import { RichTextRender } from '@/components';
import { Route as RenderDescriptionRoute } from '@/routes/render/productionDescription';
const ProductDescription = () => {
  const { productId, storeKey, summary } = useSearch({
    from: RenderDescriptionRoute.fullPath,
  });

  const { data: productDetailsResponse } = useQuery({
    queryKey: ['getProductDescriptionRender'],
    queryFn: () =>
      getSFProductsDetailsById({
        id: productId || 0,
        StoreKey: storeKey || '',
      }),
    enabled: !!storeKey && !!productId,
  });

  useEffect(() => {
    localStorage.setItem('iframesdata', 'hi');
  }, []);

  const productData = productDetailsResponse?.Data;
  return (
    <div className="w-full">
      {!summary && (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <React.Fragment>
          {productData?.Description && (
            <RichTextRender initialVal={productData?.Description} />
          )}
        </React.Fragment>
      )}

      {summary && (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
          {productData?.Summary && (
            <RichTextRender initialVal={productData?.Summary} />
          )}
        </>
      )}
    </div>
  );
};

export default ProductDescription;
