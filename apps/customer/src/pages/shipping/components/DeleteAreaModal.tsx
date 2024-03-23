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
import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { deleteArea } from '../api';

const DeleteAreaModal: React.FC<{ areaId: number }> = ({ areaId }) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutate: deleteAreaHandler, isPending } = useMutation({
    mutationFn: deleteArea,
    onSuccess: (response) => {
      queryClient.refetchQueries({ queryKey: ['getStoreAreasZones'] });
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
        <AlertDialogTrigger>Delete Area/Zone</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              area/zone (ID = {areaId}) and remove this area data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-800 hover:text-white"
              disabled={isPending}
              onClick={() => {
                deleteAreaHandler(areaId);
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
