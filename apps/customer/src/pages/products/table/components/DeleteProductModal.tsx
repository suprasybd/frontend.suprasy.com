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
} from '@customer/components/index';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { deleteProduct } from '../../api';

const DeleteProductModal: React.FC<{ productId: number }> = ({ productId }) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutate: deleteProductHandler, isPending } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (response) => {
      queryClient.refetchQueries({ queryKey: ['getUserStoresProductsList'] });
      toast({
        title: 'Product Delete',
        description: response.Message,
        variant: 'default',
      });
    },
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Product Delete',
        description: response.response.data.Message,
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
              className="bg-red-500 text-white hover:bg-red-800 hover:text-white"
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
