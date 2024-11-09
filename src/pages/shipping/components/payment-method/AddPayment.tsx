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
import { addPayment, getPaymentById, updatePayment } from '../../api';
import { paymentSchema } from './Method.zod';
import { usePaymentStore } from './paymentStore';
import useTurnStileHook from '@/hooks/turnstile';
import { Turnstile } from '@marsidev/react-turnstile';
import { ReloadIcon } from '@radix-ui/react-icons';

const AddPayment: React.FC = () => {
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      PaymentMethod: '',
      Description: '',
    },
  });
  const isModalOpen = usePaymentStore((state) => state.isModalOpen);
  const toggleModal = usePaymentStore((state) => state.toggleModal);
  const clearParams = usePaymentStore((state) => state.clearPaymentModalParams);

  const update = usePaymentStore((state) => state.params).update;
  const paymentId = usePaymentStore((state) => state.params).paymentId;

  const { toast } = useToast();
  const closeBtn = useRef(null);
  const queryClient = useQueryClient();

  const { data: paymentDataResponse } = useQuery({
    queryKey: ['getPaymentDetails', paymentId],
    queryFn: () => getPaymentById(paymentId || 0),
    enabled: !!paymentId,
  });

  const paymentData = paymentDataResponse?.Data;

  useEffect(() => {
    if (paymentData) {
      form.setValue('PaymentMethod', paymentData.PaymentMethod);
      form.setValue('Description', paymentData.Description);
    }
  }, [paymentData, form]);

  const { mutate: handleAddPayment, isPending } = useMutation({
    mutationFn: addPayment,
    onSuccess: (response) => {
      if (closeBtn.current) {
        (closeBtn.current as { click: () => void }).click();
      }

      void queryClient.refetchQueries({
        queryKey: ['getStorePaymentsList'],
      });

      toast({
        title: 'Add Payment Method',
        description: response.Message,
        variant: 'default',
      });
    },
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Add Payment Method',
        description: response.response.data.Message,
        variant: 'destructive',
      });
    },
  });

  const { mutate: handleUpdatePayment, isPending: isUpdating } = useMutation({
    mutationFn: updatePayment,
    onSuccess: (response) => {
      if (closeBtn.current) {
        (closeBtn.current as { click: () => void }).click();
      }

      void queryClient.refetchQueries({
        queryKey: ['getStorePaymentsList'],
      });

      toast({
        title: 'Update Payment Method',
        description: response.Message,
        variant: 'default',
      });
    },
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Update Payment Method',
        description: response.response.data.Message,
        variant: 'destructive',
      });
    },
  });

  function onSubmit(
    values: z.infer<typeof paymentSchema>,
    turnstileResponse: string | null
  ) {
    if (update) {
      handleUpdatePayment({
        Id: paymentId,
        ...values,
        'cf-turnstile-response': turnstileResponse,
      } as any);
    } else {
      handleAddPayment({
        ...values,
        'cf-turnstile-response': turnstileResponse,
      } as z.infer<typeof paymentSchema>);
    }
  }

  const forceUpdate = () => {
    window.location.reload();
  };

  const handleFormWrapper = (e: any) => {
    e.preventDefault();
    try {
      const tRes = e.target['cf-turnstile-response'].value;

      if (!tRes) return;

      form.handleSubmit((values: z.infer<typeof paymentSchema>) =>
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
          Add Payment Method
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {!update ? 'Add' : 'Update'} Payment Method
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleFormWrapper} className="space-y-6">
            <FormField
              control={form.control}
              name="PaymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Payment Method
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter payment method name" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Enter a name for this payment method
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
                      placeholder="Enter payment method description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Provide details about this payment method
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
                      ? `${update ? 'Updating' : 'Adding'} Payment Method...`
                      : `${update ? 'Update' : 'Add'} Payment Method`}
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

export default AddPayment;
