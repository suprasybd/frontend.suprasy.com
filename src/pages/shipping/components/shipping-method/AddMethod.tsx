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
  DialogHeader,
  DialogTitle,
  Textarea,
} from '@/components/index';
import React, { useEffect, useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { addMethod, getMethodById, updateMethod } from '../../api';
import { methodSchema } from './Method.zod';
import { useShippingStoreMethod } from './shippingStore';
import useTurnStileHook from '@/hooks/turnstile';
import { Turnstile } from '@marsidev/react-turnstile';
import { ReloadIcon } from '@radix-ui/react-icons';

const AddMethod: React.FC = () => {
  const form = useForm<z.infer<typeof methodSchema>>({
    resolver: zodResolver(methodSchema),
    defaultValues: {
      DeliveryMethod: 'COD',
      Cost: 50,
      Description: '',
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
      form.setValue('DeliveryMethod', methodData.DeliveryMethod);
      form.setValue('Cost', methodData.Cost);
      form.setValue('Description', methodData.Description);
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
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Add method',
        description: response.response.data.Message,
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
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Update Method',
        description: response.response.data.Message,
        variant: 'destructive',
      });
    },
  });

  function onSubmit(
    values: z.infer<typeof methodSchema>,
    turnstileResponse: string | null
  ) {
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

      form.handleSubmit((values: z.infer<typeof methodSchema>) =>
        onSubmit(values, tRes)
      )(e);
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
        <Button className="my-3" variant="gradiantT">
          Add Delivery Method
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {!update ? 'Add' : 'Update'} Delivery Method
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleFormWrapper} className="space-y-6">
            <FormField
              control={form.control}
              name="DeliveryMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Delivery Method
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter delivery method" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Choose between COD or UPFRONT payment methods
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter delivery cost"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Enter the delivery cost for this method
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter delivery method description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Provide details about this delivery method
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Turnstile
              options={{ size: 'auto' }}
              siteKey="0x4AAAAAAAQW6BNxMGjPxRxa"
              className="mt-4"
            />

            <div className="flex gap-4 mt-6">
              <DialogClose ref={closeBtn}>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    if (closeBtn.current) {
                      (closeBtn.current as { click: () => void }).click();
                    }
                  }}
                  variant="outline"
                  className="w-[120px]"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="defaultGradiant"
                className="flex-1"
                type="submit"
                disabled={isPending || isUpdating || !turnstileLoaded}
              >
                {!turnstileLoaded ? (
                  <div className="flex items-center">
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    <span>Please wait...</span>
                  </div>
                ) : (
                  <span>
                    {isPending || isUpdating
                      ? `${update ? 'Updating' : 'Adding'} Method...`
                      : `${update ? 'Update' : 'Add'} Method`}
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
