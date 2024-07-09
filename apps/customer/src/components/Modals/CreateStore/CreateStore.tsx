import { useModalStore } from '@customer/store/modalStore';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@customer/components/index';
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
} from '@customer/components/index';
import { Input } from '@customer/components/index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createStore } from './api';
import { getPlan, getUserBalance } from '@customer/pages/home/api';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@customer/components/index';
import { MONTHLY_COST } from '@customer/config/api';
import { checkSubDomain } from '@customer/pages/turnstile/api';
import { useDebounce } from 'use-debounce';

const formSchema = z.object({
  StoreName: z
    .string()
    .min(2, {
      message: 'Store Name must be at least 2 characters.',
    })
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message: "Store name can't have special char or numbers",
    })
    .max(150),

  SubDomain: z
    .string()
    .min(2, {
      message: 'Subdomain must be at least 2 characters.',
    })
    .regex(/^[a-zA-Z-]+$/, {
      message: "Subdomain can't have special char or spaces",
    })
    .max(150),
});

const CreateStoreModal: React.FC = () => {
  const { modal, clearModalPath } = useModalStore((state) => state);
  const modalName = modal.modal;
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'all',
    resolver: zodResolver(formSchema),
    defaultValues: {
      StoreName: '',
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
    enabled: modalOpen,
  });
  const { data: balanceResponse, isSuccess: balanceSuccess } = useQuery({
    queryKey: ['getUserBalance'],
    queryFn: getUserBalance,
    enabled: modalOpen,
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
      queryClient.refetchQueries({ queryKey: ['getUserStoresList'] });

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

  const subdomain = form.watch('SubDomain');

  const [debouncdedSubdomain] = useDebounce(subdomain, 500);

  const { isError } = useQuery({
    queryKey: ['checkSubDomain', debouncdedSubdomain],
    queryFn: () => checkSubDomain(debouncdedSubdomain),
    retry: false,
    enabled: !!debouncdedSubdomain,
  });

  useEffect(() => {
    if (isError) {
      form.setError('SubDomain', { message: 'Subdomain already taken' });
      form.setFocus('SubDomain');
    } else {
      form.clearErrors('SubDomain');
    }
  }, [isError]);

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
                name="SubDomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub Domain</FormLabel>
                    <FormControl>
                      <Input
                        FormError={!!form.formState.errors.StoreName}
                        placeholder="Sub Domain"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Subdomain: store-{subdomain}.suprasy.com
                    </FormDescription>
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
                              {MONTHLY_COST} BDT will be deducted from your
                              balance
                            </div>
                            {balanceSuccess && balance && planData && (
                              <div>
                                Remaining balance will be :{' '}
                                {balance?.Balance - MONTHLY_COST}
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

              <Button
                disabled={!haveBalance || isError}
                type="submit"
                className="w-full"
              >
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
