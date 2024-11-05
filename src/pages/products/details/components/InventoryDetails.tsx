import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import React, { useMemo } from 'react';
import { getProductsDetails, getProductsMultipleVariants } from '../../api';
import { StorefrontVariants } from '../../api/types';
import { DataTable } from '../../../../components/Table/table';
import { inventoryDetailsColumn } from './columns';
import { LoaderMain } from '../../../../components/Loader/Loader';

const InventoryDetails: React.FC = () => {
  const { productId } = useParams({ strict: false }) as {
    storeKey: string;
    productId: string;
  };

  // @Api - @Data Fetching

  const { data: productDetailsResponse } = useQuery({
    queryKey: ['getProductDetails', productId],
    queryFn: () => getProductsDetails(parseInt(productId) || 0),

    enabled: !!productId,
  });

  const productDetails = productDetailsResponse?.Data;

  const {
    data: productMultipleVariantsResponse,
    isLoading: inventoryLoadingHasVariant,
  } = useQuery({
    queryKey: ['getProductsMultipleVariantsOptionsValueInventory', productId],
    queryFn: () => getProductsMultipleVariants(parseInt(productId) || 0),
    enabled: !!productId && productDetails?.HasVariant,
  });

  // const {
  //   data: productVariantsResponse,
  //   isLoading: inventoryLoadingNoVariants,
  // } = useQuery({
  //   queryKey: ['getProductVariantsDetails', productId],
  //   queryFn: () => getProductsVariantsDetails(parseInt(productId) || 0),
  //   enabled: !!productId && !productDetails?.HasVariant,
  // });

  // const productVariantDetails = productVariantsResponse?.Data;

  const productsMultipleVariants = productMultipleVariantsResponse?.Data;

  // const formattedMultipleVariantsOptionsValue = useMemo(() => {
  //   if (productsMultipleVariants && productDetails?.HasVariant) {
  //     const uniqueVariants: Record<
  //       number | string,
  //       {
  //         variant: StorefrontVariants | null;
  //         options: Array<string>;
  //       }
  //     > = {};

  //     productsMultipleVariants
  //       .slice()
  //       .reverse()
  //       .forEach((variantDetails) => {
  //         if (!uniqueVariants[variantDetails.storefront_variants.Id]) {
  //           uniqueVariants[variantDetails.storefront_variants.Id] = {
  //             variant: null,
  //             options: [],
  //           };
  //         }

  //         if (!uniqueVariants[variantDetails.storefront_variants.Id].variant) {
  //           uniqueVariants[variantDetails.storefront_variants.Id].variant =
  //             variantDetails.storefront_variants;
  //         }

  //         uniqueVariants[variantDetails.storefront_variants.Id].options.push(
  //           variantDetails.storefront_options_value.Value
  //         );
  //       });

  //     const formattedData = Object.values(uniqueVariants).map((data) => ({
  //       Value: data.options.join('-'),
  //       Price: data.variant?.Price as number,
  //       Inventory: data.variant?.Inventory as number,
  //       ProductId: data.variant?.ProductId as number,
  //       StoreKey: data.variant?.StoreKey as string,
  //     }));

  //     return formattedData;
  //   } else {
  //     return [
  //       {
  //         Value: productDetails?.Title.slice(0, 30) + ' ...',
  //         Price: productVariantDetails?.Price as number,
  //         Inventory: productVariantDetails?.Inventory as number,
  //         ProductId: productVariantDetails?.ProductId as number,
  //         StoreKey: productVariantDetails?.StoreKey as string,
  //       },
  //     ];
  //   }
  // }, [productsMultipleVariants, productDetails, productVariantDetails]);

  // const inventoryLoading =
  //   inventoryLoadingHasVariant || inventoryLoadingNoVariants;

  return (
    <div>
      <h1 className="text-lg font-bold my-3">Inventory Details</h1>

      {/* {inventoryLoading && <LoaderMain />}

      {!inventoryLoading && formattedMultipleVariantsOptionsValue?.length && (
        <DataTable
          columns={inventoryDetailsColumn}
          data={formattedMultipleVariantsOptionsValue || []}
        />
      )} */}
    </div>
  );
};

export default InventoryDetails;
