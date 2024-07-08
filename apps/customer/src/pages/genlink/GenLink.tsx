/* eslint-disable jsx-a11y/anchor-has-content */
import { Button } from '@customer/components';
import { ProductCard } from '@customer/components/Modals/ProductSelection/ProductSelection';
import { useModalStore } from '@customer/store/modalStore';
import { useProductSelectionVariantStore } from '@customer/store/productSelectionVariant';
import React, { useEffect, useState } from 'react';

import { encode } from 'js-base64';
import { useQuery } from '@tanstack/react-query';
import { getMainDomain } from '../turnstile/api';

const GenLink = () => {
  const { setModalPath } = useModalStore((state) => state);
  const { Product, setProduct } = useProductSelectionVariantStore(
    (state) => state
  );

  const [prodList, setProdList] =
    useState<{ ProductId: number; Variant: string | undefined }[]>();

  const { data: mainDomainResponse } = useQuery({
    queryKey: ['getMainDomain'],
    queryFn: getMainDomain,
  });

  const mainDomain = mainDomainResponse?.Data;

  useEffect(() => {
    if (Product && Product.ProductId) {
      if (prodList && prodList.length > 0) {
        setProdList([...prodList, Product]);
        setProduct(null);
      } else {
        setProdList([Product]);
        setProduct(null);
      }
    }
  }, [Product]);

  const [linkKey, setLinkKey] = useState<string>();

  return (
    <section className="w-full min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <h1 className="text-xl font-bold my-5">
        Generate Purchase Link For Direct Funnel
      </h1>

      <Button
        onClick={() => {
          setModalPath({
            modal: 'product-selection-variant',
          });
        }}
      >
        Add Produdct
      </Button>

      <div className="flex flex-wrap gap-[7px]">
        {prodList?.map((p) => (
          <div>
            <ProductCard
              className="w-fit"
              ProductId={p.ProductId}
              variant={p.Variant}
            />
          </div>
        ))}
      </div>

      {prodList && prodList.length > 0 && (
        <Button
          className="my-2"
          onClick={() => {
            if (prodList && prodList.length > 0) {
              const key = encode(JSON.stringify(prodList));
              setLinkKey(key);
            }
          }}
        >
          Generate Link
        </Button>
      )}

      {linkKey && (
        <p className="my-2">
          Generated Link:
          <a
            target="__blank"
            className="text-blue-600 underline"
            href={`http://${mainDomain?.DomainName}/?products=${linkKey}`}
          >
            {' '}
            {mainDomain?.DomainName}/checkout?products={linkKey}
          </a>
        </p>
      )}
    </section>
  );
};

export default GenLink;
