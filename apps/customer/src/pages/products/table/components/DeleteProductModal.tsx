import React, { useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  useToast,
} from '@frontend.suprasy.com/ui';
import { deleteProduct } from '../../api';
import { useMutation } from '@tanstack/react-query';
import { ReloadIcon } from '@radix-ui/react-icons';

const DeleteProductModal: React.FC<{ productId: string }> = ({ productId }) => {
  const { toast } = useToast();

  const { mutate: deleteProductHandler, isPending } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (response) => {
      toast({
        title: 'Product Delete',
        description: response.Message,
        variant: 'default',
      });
    },
    onError: () => {
      toast({
        title: 'Product Delete',
        description: 'Product delete failed!',
        variant: 'destructive',
      });
    },
  });

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger>Delete Product</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              product (ID = {productId}) and remove this products data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={() => {
                deleteProductHandler(productId);
              }}
            >
              Confirm Delete
              {isPending && (
                <ReloadIcon className="mr-2 ml-2 h-4 w-4 animate-spin" />
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteProductModal;
