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
import { deleteMethod } from '../../api';

const DeleteAreaModal: React.FC<{ methodId: number }> = ({ methodId }) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutate: deleteAreaHandler, isPending } = useMutation({
    mutationFn: deleteMethod,
    onSuccess: (response) => {
      queryClient.refetchQueries({ queryKey: ['getStoreShipingMethodsList'] });
      toast({
        title: 'Method Delete',
        description: response.Message,
        variant: 'default',
      });
    },
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Method Delete',
        description: response.response.data.Message,
        variant: 'destructive',
      });
    },
  });

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger>Delete Delivery Method</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              delivery method (ID = {methodId}) and remove this area data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-800 hover:text-white"
              disabled={isPending}
              onClick={() => {
                deleteAreaHandler(methodId);
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

export default DeleteAreaModal;
