import { useModalStore } from '@customer/store/modalStore';
import {
  Button,
  cn,
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
import {
  RadioGroup,
  RadioGroupItem,
} from '@customer/components/ui/radio-group';

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

  planId: z.number(),
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
      planId: 1,
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
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Store Create',
        description: response.response.data.Message,
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
    handleCreateStore({
      ...values,
      planId: values.planId,
    });
  }

  const haveBalance = useMemo(() => {
    if (balance && planResponse?.Data) {
      const selectedPlan = planResponse.Data.find(
        (p) => p.Id === form.getValues('planId')
      );
      if (selectedPlan && balance.Balance >= selectedPlan.MonthlyPrice) {
        return true;
      }
      return false;
    }
    return false;
  }, [balance, planResponse?.Data, form]);

  const shouldDisableCreate = useMemo(() => {
    if (balanceResponse?.Data.IsTrial) {
      return false;
    }
    if (!haveBalance) {
      return true;
    }
    return false;
  }, [haveBalance, balanceResponse?.Data.IsTrial]);

  const getPlanFeatures = (featuresJson: string): string[] => {
    try {
      return JSON.parse(featuresJson);
    } catch {
      return [];
    }
  };
  const selectedPlanId = form.watch('planId');
  console.log(selectedPlanId);
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
        <DialogContent className="max-w-[500px] h-[90vh] overflow-y-scroll p-0">
          <div className="flex flex-col h-full">
            <div className="p-6 pb-2">
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-2xl font-semibold">
                  Create Store
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Fill in the details below to create your new store.
                </DialogDescription>
              </DialogHeader>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col h-full"
              >
                <div className="flex-1 overflow-y-auto px-6 space-y-6">
                  <FormField
                    control={form.control}
                    name="StoreName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          Store Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            FormError={!!form.formState.errors.StoreName}
                            placeholder="Enter your store name"
                            className="h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-muted-foreground">
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
                        <FormLabel className="font-medium">
                          Sub Domain
                        </FormLabel>
                        <FormControl>
                          <Input
                            FormError={!!form.formState.errors.StoreName}
                            placeholder="Enter subdomain"
                            className="h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-muted-foreground">
                          Your store URL will be: store-{subdomain || 'example'}
                          .suprasy.com
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="planId"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Select Plan</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(parseInt(value));
                            }}
                            value={field.value?.toString()}
                            className="space-y-3"
                          >
                            {planResponse?.Data.map((plan) => (
                              <div
                                key={plan.Id}
                                className={cn(
                                  'flex items-start space-x-3 space-y-0 p-4 border rounded-lg',
                                  field.value === plan.Id &&
                                    'border-primary bg-primary/5'
                                )}
                              >
                                <RadioGroupItem
                                  value={plan.Id.toString()}
                                  id={`plan-${plan.Id}`}
                                />
                                <div className="grid gap-1.5 leading-none">
                                  <label
                                    htmlFor={`plan-${plan.Id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {plan.Name.charAt(0).toUpperCase() +
                                      plan.Name.slice(1)}{' '}
                                    - {plan.MonthlyPrice} BDT/month
                                  </label>
                                  <ul className="text-sm text-muted-foreground list-disc pl-4">
                                    {getPlanFeatures(plan.Features).map(
                                      (feature, idx) => (
                                        <li key={idx}>{feature}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {balanceSuccess &&
                    balance &&
                    planData &&
                    !balanceResponse.Data.IsTrial && (
                      <div className="space-y-4">
                        {haveBalance ? (
                          <Alert className="bg-muted/50 border">
                            <AlertTitle className="font-medium">
                              Transaction Details
                            </AlertTitle>
                            <AlertDescription className="text-sm">
                              {isSuccess && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span>Monthly Cost:</span>
                                    <span className="font-medium">
                                      {planResponse?.Data.find(
                                        (p) => p.Id === form.getValues('planId')
                                      )?.MonthlyPrice ?? 0}{' '}
                                      BDT
                                    </span>
                                  </div>
                                  {balanceSuccess && balance && planData && (
                                    <div className="flex items-center justify-between">
                                      <span>Remaining Balance:</span>
                                      <span className="font-medium">
                                        {balance?.Balance -
                                          (planResponse?.Data.find(
                                            (p) =>
                                              p.Id === form.getValues('planId')
                                          )?.MonthlyPrice ?? 0)}{' '}
                                        BDT
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <Alert
                            variant="destructive"
                            className="border-destructive/50"
                          >
                            <AlertTitle className="font-medium">
                              Not enough balance
                            </AlertTitle>
                            <AlertDescription>
                              Please add funds to your account to create a
                              store.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}

                  {balanceResponse?.Data.IsTrial && (
                    <Alert className="bg-primary/10 border-primary/20">
                      <AlertTitle className="font-medium">
                        One Month Trial
                      </AlertTitle>
                      <AlertDescription>
                        You are eligible for 1 month trial, create your store
                        and use for 1 month free.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="p-6 mt-auto border-t">
                  <div className="flex flex-col gap-3">
                    <Button
                      disabled={
                        isError ||
                        (!balanceResponse?.Data.IsTrial &&
                          (balance?.Balance ?? 0) <
                            (planResponse?.Data.find(
                              (p) => p.Id === form.getValues('planId')
                            )?.MonthlyPrice ?? 0))
                      }
                      type="submit"
                      className="w-full h-10"
                    >
                      {isPending ? 'Creating...' : 'Create Store'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => closeModal()}
                      className="w-full h-10"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateStoreModal;
