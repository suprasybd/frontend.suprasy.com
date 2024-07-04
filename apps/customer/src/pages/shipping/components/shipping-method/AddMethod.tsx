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
} from '@customer/components/index';
import React, { useEffect, useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { addMethod, getMethodById, updateMethod } from '../../api';
import { methodSchema } from './Method.zod';
import { useShippingStoreMethod } from './shippingStore';
import useTurnStileHook from '@customer/hooks/turnstile';
import { Turnstile } from '@marsidev/react-turnstile';
import { ReloadIcon } from '@radix-ui/react-icons';

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
    const turnstileResponse = localStorage.getItem('cf-turnstile-in-storage');
    if (update) {
      handleUpdateMethod({
        Id: methodId,
        ...values,
        'cf-turnstile-response': turnstileResponse,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    } else {
      handleAddMethod({
        ...values,
        'cf-turnstile-response': turnstileResponse,
      } as z.infer<typeof methodSchema>);
    }
  }
  const forceUpdate = () => {
    window.location.reload();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormWrapper = (e: any) => {
    e.preventDefault();
    try {
      const tRes = e.target['cf-turnstile-response'].value;

      if (!tRes) return;

      localStorage.setItem('cf-turnstile-in-storage', tRes);

      form.handleSubmit(onSubmit)(e);
    } catch (error) {
      forceUpdate();
    }
  };
  const [turnstileLoaded] = useTurnStileHook();

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
          <form onSubmit={handleFormWrapper} className="space-y-8">
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

            <Turnstile
              options={{ size: 'auto' }}
              siteKey="0x4AAAAAAAQW6BNxMGjPxRxa"
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
                  variant={'outline'}
                  className="w-full"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant={'defaultGradiant'}
                className="w-full"
                type="submit"
                disabled={isPending || isUpdating || !turnstileLoaded}
              >
                {!turnstileLoaded && (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    wait a few moment..
                  </>
                )}
                {turnstileLoaded && (
                  <span>
                    {isPending || isUpdating
                      ? `${update ? 'Updating' : 'Adding'} Method..`
                      : `${update ? 'Update' : 'Add'} This Method`}
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMethod;
