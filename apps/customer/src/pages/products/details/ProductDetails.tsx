import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import React from 'react';
import { getProductsDetails } from '../api';
import ProductImagesList from './components/ProductImagesList';
import InventoryDetails from './components/InventoryDetails';
import {
  RichTextRender,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@frontend.suprasy.com/ui';

const ProductsDetailsMain: React.FC = () => {
  return (
    <section className="w-full max-w-[54rem] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <Tabs defaultValue="details" className="">
        <div className="w-full border-b-[1px] border-gray-200">
          <TabsList className="mt-1">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details">
          <ProductDetails />
        </TabsContent>
        <TabsContent value="images">
          <ProductImagesList />
        </TabsContent>
        <TabsContent value="inventory">
          <InventoryDetails />
        </TabsContent>
      </Tabs>
    </section>
  );
};

const ProductDetails: React.FC = () => {
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

  return (
    <section className="my-4">
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
    </section>
  );
};

export default ProductsDetailsMain;
