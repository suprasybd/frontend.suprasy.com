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
} from '@/components/index';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { deletePayment } from '../../api';

const DeletePaymentModal: React.FC<{ paymentId: number }> = ({ paymentId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: deletePaymentHandler, isPending } = useMutation({
    mutationFn: deletePayment,
    onSuccess: (response) => {
      queryClient.refetchQueries({ queryKey: ['getStorePaymentsList'] });
      toast({
        title: 'Payment Method Delete',
        description: response.Message,
        variant: 'default',
      });
    },
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Payment Method Delete',
        description: response.response.data.Message,
        variant: 'destructive',
      });
    },
  });

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger>Delete Payment Method</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              payment method (ID = {paymentId}) and remove this payment method
              data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-800 hover:text-white"
              disabled={isPending}
              onClick={() => {
                deletePaymentHandler(paymentId);
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

export default DeletePaymentModal;
