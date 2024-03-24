import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from '@frontend.suprasy.com/ui';
import React, { useEffect, useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { addMethod, getMethodById, updateMethod } from '../../api';
import { methodSchema } from './Method.zod';
import { useShippingStoreMethod } from './shippingStore';

const AddMethod: React.FC = () => {
  const form = useForm<z.infer<typeof methodSchema>>({
    resolver: zodResolver(methodSchema),
    defaultValues: {
      Cost: 50,
      DeliveryMethod: 'COD',
    },
  });
  const isModalOpen = useShippingStoreMethod((state) => state.isModalOpen);
  const toggleModal = useShippingStoreMethod((state) => state.toggleModal);
  const clearParams = useShippingStoreMethod(
    (state) => state.clearShippingModalParams
  );

  const update = useShippingStoreMethod((state) => state.params).update;
  const methodId = useShippingStoreMethod((state) => state.params).methodId;

  const { toast } = useToast();
  const closeBtn = useRef(null);
  const queryClient = useQueryClient();

  const { data: methodDataResponse } = useQuery({
    queryKey: ['getMethodDeatils', methodId],
    queryFn: () => getMethodById(methodId || 0),
    enabled: !!methodId,
  });

  const methodData = methodDataResponse?.Data;

  useEffect(() => {
    if (methodData) {
      form.setValue('Cost', methodData.Cost);
      form.setValue('DeliveryMethod', methodData.DeliveryMethod);
    }
  }, [methodData, form]);

  const { mutate: handleAddMethod, isPending } = useMutation({
    mutationFn: addMethod,
    onSuccess: (response) => {
      if (closeBtn.current) {
        (closeBtn.current as { click: () => void }).click();
      }

      void queryClient.refetchQueries({
        queryKey: ['getStoreShipingMethodsList'],
      });

      toast({
        title: 'Add method',
        description: response.Message,
        variant: 'default',
      });
    },
    onError: () => {
      toast({
        title: 'Add method',
        description: 'Add method failed!',
        variant: 'destructive',
      });
    },
  });

  const { mutate: handleUpdateMethod, isPending: isUpdating } = useMutation({
    mutationFn: updateMethod,
    onSuccess: (response) => {
      if (closeBtn.current) {
        (closeBtn.current as { click: () => void }).click();
      }

      void queryClient.refetchQueries({
        queryKey: ['getStoreShipingMethodsList'],
      });

      toast({
        title: 'Update Method',
        description: response.Message,
        variant: 'default',
      });
    },
    onError: () => {
      toast({
        title: 'Update Method',
        description: 'Update Method failed!',
        variant: 'destructive',
      });
    },
  });

  function onSubmit(values: z.infer<typeof methodSchema>) {
    if (update) {
      handleUpdateMethod({ Id: methodId, ...values });
    } else {
      handleAddMethod(values);
    }
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(data) => {
        if (!data) {
          clearParams();
          toggleModal();
        }
      }}
    >
      <DialogTrigger onClick={() => toggleModal()}>
        <Button className="my-3" variant={'gradiantT'}>
          Add Delivery Method
        </Button>
      </DialogTrigger>
      <DialogContent className="my-3">
        <h1>{!update ? 'Add' : 'Update'} Delivery Method</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="DeliveryMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Method</FormLabel>
                  <FormControl>
                    <Input placeholder="Delivery Method" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the delivery method. (COD, UPFRONT)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Cost"
              render={({ field }) => (
                <FormItem className="!mt-0">
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Cost" {...field} />
                  </FormControl>
                  <FormDescription>This is the area/zone name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-[8px]">
              <DialogClose className="w-full" ref={closeBtn}>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    if (closeBtn.current) {
                      (closeBtn.current as { click: () => void }).click();
                    }
                  }}
                  variant={'destructive'}
                  className="w-full"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant={'gradiantT'}
                className="w-full"
                type="submit"
                disabled={isPending || isUpdating}
              >
                {isPending || isUpdating
                  ? `${update ? 'Updating' : 'Adding'} Area..`
                  : `${update ? 'Update' : 'Add'} This Area`}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMethod;
