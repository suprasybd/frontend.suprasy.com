import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
} from '@customer/components/index';
import { activeFilters } from '@customer/libs/helpers/filters';
import {
  getProductAttributes,
  getProductOptions,
  getProductsDetails,
  getProductsImages,
  getUserStoresProductsList,
} from '@customer/pages/products/api';
import { useModalStore } from '@customer/store/modalStore';
import { useProductSelectionVariantStore } from '@customer/store/productSelectionVariant';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

const ProductSelectionWithVariation: React.FC = () => {
  const { modal, clearModalPath } = useModalStore((state) => state);
  const { setProduct } = useProductSelectionVariantStore((state) => state);
  const modalName = modal.modal;
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [Title, setTitle] = useState<string>('');

  useEffect(() => {
    if (modalName === 'product-selection-variant') {
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
                    <div className="w-fit">
                      <ProductCard
                        ProductId={product.Id}
                        closeModal={closeModal}
                      />
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

const ProductCard: React.FC<{
  ProductId: number;
  className?: string;
  closeModal: () => void;
}> = ({ ProductId, className, closeModal }) => {
  const { data: imagesResposne } = useQuery({
    queryFn: () => getProductsImages(ProductId),
    queryKey: ['getProductImagesForSelectionModal', ProductId],
    enabled: !!ProductId,
  });

  const { setProduct } = useProductSelectionVariantStore((state) => state);

  const { data: productDetailsResposne } = useQuery({
    queryFn: () => getProductsDetails(ProductId),
    queryKey: ['getProductDetailsForSelectionModal', ProductId],
    enabled: !!ProductId,
  });

  const images = imagesResposne?.Data;
  const productDetails = productDetailsResposne?.Data;

  const hasVariant = productDetails?.HasVariant;

  const { data: productAttributeResponse } = useQuery({
    queryKey: ['getProductsOptionsinModal', ProductId],
    queryFn: () => getProductOptions(ProductId || 0),
    enabled: !!ProductId && hasVariant,
  });

  const productAttributes = productAttributeResponse?.Data;

  return (
    <div
      onClick={() => {
        if (!hasVariant && productDetails?.Id) {
          setProduct({
            ProductId: productDetails?.Id,
            Variant: undefined,
          });
          closeModal();
        }
      }}
    >
      <div
        className="p-3 rounded-md my-2 min-h-[120px] bg-slate-800 text-white hover:bg-slate-700 cursor-pointer"
        key={ProductId}
      >
        {images && images.length > 0 && (
          <img
            className="rounded-md h-[150px] w-[150px] border-2 border-white"
            alt="product"
            src={images[0].ImageUrl}
            width={'150px'}
            height={'150px'}
          />
        )}
        <div className="my-3">
          <p className="text-sm max-w-[150px]">
            Title: {productDetails?.Title}
          </p>
          <p className="text-sm">Product Id: {productDetails?.Id}</p>

          <div className="flex gap-[10px] items-center flex-wrap">
            {productAttributes?.map((a) => (
              <div
                onClick={() => {
                  if (hasVariant && productDetails.Id) {
                    setProduct({
                      ProductId: productDetails.Id,
                      Variant: a.Value,
                    });
                    closeModal();
                  }
                }}
                className="p-3 w-fit rounded-md hover:bg-slate-400 bg-slate-500 text-white"
              >
                {a.Value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSelectionWithVariation;
