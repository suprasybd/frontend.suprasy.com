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
  getProductsImages,
  getUserStoresProductsList,
} from '@customer/pages/products/api';
import { useModalStore } from '@customer/store/modalStore';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

const ProductSelection: React.FC = () => {
  const { modal, clearModalPath } = useModalStore((state) => state);
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
                placeholder="Title product by title"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              {/* list */}
              <div className="my-5">
                {products &&
                  products.length > 0 &&
                  products.map((product) => (
                    <ProductCard ProductId={product.Id} Title={product.Title} />
                  ))}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ProductCard: React.FC<{ ProductId: number; Title: string }> = ({
  ProductId,
  Title,
}) => {
  const { data: imagesResposne } = useQuery({
    queryFn: () => getProductsImages(ProductId),
    queryKey: ['getProductImagesForSelectionModal', ProductId],
    enabled: !!ProductId,
  });

  const images = imagesResposne?.Data;

  return (
    <div>
      <div
        className="p-3 rounded-md my-2 bg-slate-500 text-white hover:bg-slate-700 cursor-pointer"
        key={ProductId}
      >
        <p>{Title}</p>
        {images && images.length > 0 && (
          <img
            className="rounded-md"
            alt="product"
            src={images[0].ImageUrl}
            width={'50px'}
            height={'auto'}
          />
        )}
      </div>
    </div>
  );
};

export default ProductSelection;
