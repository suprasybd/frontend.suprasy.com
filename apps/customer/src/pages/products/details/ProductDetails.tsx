import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import React from 'react';
import { getProductsDetails, getVariations } from '../api';
import ProductImagesList from './components/ProductImagesList';
import {
  RichTextRender,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
} from '@customer/components/index';

import { Calendar, Package, Package2 } from 'lucide-react';
import { formatPrice } from '@customer/libs/helpers/formatdate';

const ProductsDetailsMain: React.FC = () => {
  return (
    <section className="w-full max-w-[54rem] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <Tabs defaultValue="details" className="">
        <div className="w-full border-b-[1px] border-gray-200">
          <TabsList className="mt-1">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details">
          <ProductDetails />
        </TabsContent>
        <TabsContent value="images">
          <ProductImagesList />
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

  const { data: productDetailsResponse, isLoading: isLoadingDetails } =
    useQuery({
      queryKey: ['getProductDetails', productId],
      queryFn: () => getProductsDetails(parseInt(productId) || 0),
      enabled: !!productId,
    });

  const { data: variationsResponse, isLoading: isLoadingVariations } = useQuery(
    {
      queryKey: ['getProductVariations', productId],
      queryFn: () => getVariations(parseInt(productId) || 0),
      enabled: !!productId,
    }
  );

  const productDetails = productDetailsResponse?.Data;
  const variations = variationsResponse?.Data;

  if (isLoadingDetails || isLoadingVariations) {
    return <div>Loading...</div>;
  }

  return (
    <section className="my-4 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{productDetails?.Title}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Created:{' '}
              {new Date(productDetails?.CreatedAt || '').toLocaleDateString()}
            </span>
          </div>
        </div>
        <Badge
          variant={
            productDetails?.Status === 'active' ? 'default' : 'secondary'
          }
        >
          {productDetails?.Status}
        </Badge>
      </div>

      {/* Product Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info Card */}
        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="font-semibold text-lg">Basic Information</h2>

          <div>
            <span className="text-sm text-muted-foreground">Product ID</span>
            <p className="font-medium">{productDetails?.Id}</p>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">Slug</span>
            <p className="font-medium break-all">{productDetails?.Slug}</p>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">Category ID</span>
            <p className="font-medium">
              {productDetails?.CategoryId || 'Not assigned'}
            </p>
          </div>
        </div>

        {/* Variations Card */}
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Package2 className="h-5 w-5" />
            <h2 className="font-semibold text-lg">Product Variations</h2>
          </div>

          {variations && variations.length > 0 ? (
            <div className="space-y-3">
              {variations.map((variant) => (
                <div
                  key={variant.Id}
                  className="flex justify-between items-center p-3 bg-muted rounded-md"
                >
                  <div>
                    <p className="font-medium">{variant.ChoiceName}</p>
                    <p className="text-sm text-muted-foreground">
                      SKU: {variant.Sku || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(variant.Price)}</p>
                    <p className="text-sm text-muted-foreground">
                      Stock: {variant.Inventory}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No variations available</p>
          )}
        </div>
      </div>

      {/* Description Section */}
      <div className="border rounded-lg p-4 space-y-4">
        <h2 className="font-semibold text-lg">Product Description</h2>
        {productDetails?.Description ? (
          <RichTextRender initialVal={productDetails.Description} />
        ) : (
          <p className="text-muted-foreground">No description available</p>
        )}
      </div>

      {/* Summary Section */}
      <div className="border rounded-lg p-4 space-y-4">
        <h2 className="font-semibold text-lg">Product Summary</h2>
        {productDetails?.Summary ? (
          <RichTextRender initialVal={productDetails.Summary} />
        ) : (
          <p className="text-muted-foreground">No summary available</p>
        )}
      </div>
    </section>
  );
};

export default ProductsDetailsMain;
