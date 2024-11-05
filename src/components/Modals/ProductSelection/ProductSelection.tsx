import {
  Badge,
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
} from '@/components/index';
import { activeFilters } from '@/libs/helpers/filters';
import {
  getProductsDetails,
  getProductsImages,
  getUserStoresProductsList,
  getVariations,
} from '@/pages/products/api';
import { useModalStore } from '@/store/modalStore';
import { useProductSelectionStore } from '@/store/productSelection';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import { Calendar, ImageIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const ProductSelection: React.FC = () => {
  const { modal, clearModalPath } = useModalStore((state) => state);
  const { setProduct } = useProductSelectionStore((state) => state);
  const modalName = modal.modal;
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [Title, setTitle] = useState<string>('');

  useEffect(() => {
    if (modalName === 'product-selection') {
      setModalOpen(true);
    }
  }, [modalName]);

  const closeModal = () => {
    setModalOpen(false);
    clearModalPath();
  };

  const { data: productsResponse } = useQuery({
    queryKey: ['getProductsListForSelectionModal', modalOpen, Title],
    queryFn: () =>
      getUserStoresProductsList({
        ...activeFilters([
          { key: 'Title', value: Title || '', isActive: !!Title },
        ]),
      }),
    enabled: modalOpen,
  });

  const products = productsResponse?.Data;

  return (
    <div>
      <Dialog
        open={modalOpen}
        onOpenChange={(data) => {
          if (!data) {
            closeModal();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Product Selection</DialogTitle>
            <DialogDescription>
              {/* searc */}
              <Input
                placeholder="Search product by title"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              {/* list */}
              <div className="my-5 flex flex-wrap gap-[7px]">
                {products &&
                  products.length > 0 &&
                  products.map((product) => (
                    <div
                      className="w-fit"
                      onClick={() => {
                        setProduct(product.Id);
                        closeModal();
                      }}
                    >
                      <ProductCard ProductId={product.Id} compact />
                    </div>
                  ))}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ProductCardProps {
  ProductId: number;
  showActions?: boolean;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  ProductId,
  showActions = false,
  compact = false,
}) => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };
  const { data: productResponse, isLoading } = useQuery({
    queryKey: ['getProductDetails', ProductId],
    queryFn: () => getProductsDetails(ProductId),
  });

  // First fetch variations
  const { data: variationsResponse } = useQuery({
    queryKey: ['getProductVariations', ProductId],
    queryFn: () => getVariations(ProductId),
    enabled: !!ProductId,
  });

  // Then fetch images using the first variation's ID
  const firstVariationId = variationsResponse?.Data?.[0]?.Id;
  const { data: productImagesResponse } = useQuery({
    queryKey: ['getProductImages', firstVariationId],
    queryFn: () => getProductsImages(firstVariationId!),
    enabled: !!firstVariationId,
  });

  const product = productResponse?.Data;
  const images = productImagesResponse?.Data;
  const mainImage = images?.[0]?.ImageUrl;

  if (isLoading) {
    return (
      <div className="relative rounded-lg border border-border bg-card overflow-hidden">
        <div className="aspect-square w-full animate-pulse bg-muted" />
        <div className="p-3 space-y-2">
          <div className="h-4 w-2/3 animate-pulse bg-muted rounded" />
          <div className="h-4 w-1/3 animate-pulse bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="relative rounded-lg border border-destructive/50 bg-destructive/10 p-3">
        <p className="text-sm text-destructive">Product not found</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative rounded-lg border border-border bg-card overflow-hidden transition-all duration-200 hover:shadow-md',
        compact ? 'w-[200px]' : 'w-full'
      )}
    >
      {/* Image Section */}
      <div className="relative aspect-square w-full bg-muted">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.Title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-muted">
            <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <Badge
            variant={product.Status === 'active' ? 'default' : 'secondary'}
          >
            {product.Status}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 space-y-2">
        <h3 className="font-medium leading-tight line-clamp-2">
          {product.Title}
        </h3>

        {!compact && (
          <>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.Summary || 'No summary available'}
            </p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(product.CreatedAt).toLocaleDateString()}</span>
            </div>
          </>
        )}

        {/* Actions */}
        {showActions && (
          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link
                to="/store/$storeKey/products/$productId/details"
                params={{
                  storeKey: storeKey,
                  productId: product.Id.toString(),
                }}
              >
                View Details
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link
                to="/store/$storeKey/products/$productId/details"
                params={{
                  storeKey: storeKey,
                  productId: product.Id.toString(),
                }}
              >
                Edit
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSelection;
