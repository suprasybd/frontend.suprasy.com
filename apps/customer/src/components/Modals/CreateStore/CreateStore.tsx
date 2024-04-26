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
import React, { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@frontend.suprasy.com/ui';
import { Input } from '@frontend.suprasy.com/ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createStore } from './api';
import { getPlan, getUserBalance } from '@customer/pages/home/api';

import { Terminal } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@frontend.suprasy.com/ui';

const formSchema = z.object({
  StoreName: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .refine(
      (val) => /^[a-zA-Z0-9]+$/.test(val ?? ''),
      'Please enter valid name.'
    ),
  Subdomain: z
    .string()
    .min(2, 'At least put 2 characters.')
    .refine(
      (val) => /^(?!-)[a-zA-Z0-9-]{1,63}(?<!-)$/.test(val ?? ''),
      'Please enter valid subdomain.'
    ),
});

const CreateStoreModal: React.FC = () => {
  const { modal, clearModalPath } = useModalStore((state) => state);
  const modalName = modal.modal;
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      StoreName: '',
      Subdomain: '',
    },
  });

  useEffect(() => {
    if (modalName === 'create-store') {
      setModalOpen(true);
    }
  }, [modalName]);

  const closeModal = () => {
    setModalOpen(false);
    clearModalPath();
  };

  const { data: planResponse, isSuccess } = useQuery({
    queryKey: ['getPlan'],
    queryFn: getPlan,
  });
  const { data: balanceResponse, isSuccess: balanceSuccess } = useQuery({
    queryKey: ['getUserBalance'],
    queryFn: getUserBalance,
  });

  const planData = planResponse?.Data;
  const balance = balanceResponse?.Data;

  const { mutate: handleCreateStore, isPending } = useMutation({
    mutationFn: createStore,
    onSuccess: () => {
      toast({
        title: 'Store Create',
        description: 'Store create request sent successfully',
        variant: 'default',
      });

      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['getUserStoresList'] });
      }, 3000);

      closeModal();
    },
    onError: () => {
      toast({
        title: 'Store Create',
        description: 'Store create failed! Please reach out to admins!',
        variant: 'destructive',
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleCreateStore(values as any);
  }

  const haveBalance = useMemo(() => {
    if (balance && planData) {
      if (balance.Balance >= planData.MonthlyCharge) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }, [balance, planData]);

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
            <DialogTitle>Create Store</DialogTitle>
            <DialogDescription>Create Store</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="StoreName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input
                        FormError={!!form.formState.errors.StoreName}
                        placeholder="StoreName"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Subdomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub Domain</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-center">
                        <Input
                          FormError={!!form.formState.errors.Subdomain}
                          placeholder="Subdomain"
                          {...field}
                        />
                        .suprasy.com
                      </div>
                    </FormControl>
                    {form.getValues('Subdomain') && (
                      <FormDescription>
                        Your Subdomain is {form.getValues('Subdomain')}
                        .suprasy.com
                      </FormDescription>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              {balanceSuccess && balance && planData && (
                <div>
                  {haveBalance ? (
                    <Alert>
                      <AlertTitle>Transaction Details</AlertTitle>
                      <AlertDescription>
                        {isSuccess && (
                          <div>
                            <div>
                              {planData?.MonthlyCharge} BDT will be deducted
                              from your balance
                            </div>
                            {balanceSuccess && balance && planData && (
                              <div>
                                Remaining balance will be :{' '}
                                {balance?.Balance - planData?.MonthlyCharge}
                              </div>
                            )}
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant={'destructive'}>
                      <AlertTitle>Not enough balance</AlertTitle>
                      <AlertDescription>
                        You don't have enought balance.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              <Button disabled={!haveBalance} type="submit" className="w-full">
                {isPending && 'Creating...'}
                {!isPending && 'Create Store'}
              </Button>
            </form>
          </Form>

          <Button variant={'destructive'} onClick={() => closeModal()}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateStoreModal;
