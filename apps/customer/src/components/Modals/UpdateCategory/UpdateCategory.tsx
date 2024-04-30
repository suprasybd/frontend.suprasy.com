import { getCategories } from '@customer/pages/categories/api';
import { useModalStore } from '@customer/store/modalStore';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@frontend.suprasy.com/ui';
import cn from 'classnames';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { updateStoresProduct } from '@customer/pages/products/api';
import { updateProductCateogry } from './api';

const UpdateCategory: React.FC = () => {
  const { modal, clearModalPath } = useModalStore((state) => state);
  const modalName = modal.modal;
  const productId = modal.productId;
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  useEffect(() => {
    if (modalName === 'update-category-product' && productId) {
      setModalOpen(true);
    }
  }, [modalName, productId]);

  const closeModal = () => {
    setModalOpen(false);
    clearModalPath();
  };

  const { toast } = useToast();

  const { mutate: handleUpdateProductCategory } = useMutation({
    mutationFn: updateProductCateogry,
    onSuccess: () => {
      toast({
        title: 'Category update',
        description: 'category update successfull',
        variant: 'default',
      });
      closeModal();
    },
    onError: () => {
      toast({
        title: 'Category update',
        description: 'category update failed',
        variant: 'destructive',
      });
    },
  });

  const { data: categoryResponse } = useQuery({
    queryKey: ['getCategories'],
    queryFn: () => getCategories(),
  });

  const categories = categoryResponse?.Data;

  useEffect(() => {
    if (categories) {
      setSelectedCategory(categories[0].Id);
    }
  }, [categories]);

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
            <DialogTitle>Update category</DialogTitle>
          </DialogHeader>

          <div className="flex flex-wrap gap-[5px]">
            {categories?.map((category) => (
              <span
                onClick={() => {
                  setSelectedCategory(category.Id);
                }}
                className={cn(
                  'inline-block hover:bg-gray-700 hover:text-white border border-gray-300 rounded-md p-3 w-fit hover:cursor-pointer',
                  category.Id === selectedCategory && 'bg-gray-700 text-white'
                )}
              >
                {category.Name}
              </span>
            ))}
          </div>

          <Button
            onClick={() => {
              if (selectedCategory) {
                handleUpdateProductCategory({
                  categoryId: selectedCategory,
                  productId: productId as any,
                });
              }
            }}
            variant={'default'}
          >
            Update
          </Button>
          <Button onClick={() => closeModal()}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateCategory;
