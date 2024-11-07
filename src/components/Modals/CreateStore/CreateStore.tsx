import { useModalStore } from '@/store/modalStore';
import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@/components/index';
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
} from '@/components/index';
import { Input } from '@/components/index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createStore } from './api';
import { getPlan, getUserBalance } from '@/pages/home/api';

import { Alert, AlertDescription, AlertTitle } from '@/components/index';
import { MONTHLY_COST } from '@/config/api';
import { checkSubDomain } from '@/pages/turnstile/api';
import { useDebounce } from 'use-debounce';
import { Link2 } from 'lucide-react';
import { ExternalLink } from 'lucide-react';
import AddBalanceModal from '@/components/Modals/AddBalanceModal/AddBalanceModal';

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
  const [showAddBalanceModal, setShowAddBalanceModal] = useState(false);

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

  const planId = form.watch('planId');

  const haveBalance = useMemo(() => {
    if (!planId) return false;

    const selectedPlan = planResponse?.Data?.find((p) => p.Id === planId);

    // If no plan is selected, return false@
    if (!selectedPlan) return false;

    // Free plan should always be allowed
    if (selectedPlan.MonthlyPrice === 0) return true;
    // For paid plans, check balance
    return (balanceResponse?.Data?.Balance ?? 0) >= selectedPlan.MonthlyPrice;
  }, [balanceResponse?.Data, planResponse?.Data, form]);

  const selectedPlan = useMemo(() => {
    if (planResponse?.Data) {
      return planResponse.Data.find((p) => p.Id === form.getValues('planId'));
    }
    return null;
  }, [planResponse?.Data, form, planId]);

  return (
    <Dialog open={modalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-[550px] h-[90vh] overflow-scroll p-0 gap-0">
        <div className="flex flex-col h-full">
          <div className="p-6 pb-4 border-b">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl font-semibold tracking-tight">
                Create Store
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Fill in the details below to create your new store.
              </DialogDescription>
            </DialogHeader>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col h-full"
            >
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                <FormField
                  control={form.control}
                  name="StoreName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Store Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          FormError={!!form.formState.errors.StoreName}
                          placeholder="Enter your store name"
                          className="h-10 transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground/80">
                        This is your public display name.
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="SubDomain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Sub Domain
                      </FormLabel>
                      <FormControl>
                        <Input
                          FormError={!!form.formState.errors.StoreName}
                          placeholder="Enter subdomain"
                          className="h-10 transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground/80 flex items-center gap-1">
                        Your store URL will be:{' '}
                        <span className="font-medium text-foreground">
                          store-{subdomain || 'example'}.suprasy.com
                        </span>
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="planId"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium">
                        Select Plan
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-1 gap-3">
                          {planResponse?.Data.map((plan) => (
                            <div
                              key={plan.Id}
                              className={cn(
                                'relative flex flex-col p-4 cursor-pointer border rounded-lg transition-all hover:shadow-sm',
                                field.value === plan.Id
                                  ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                                  : 'hover:border-primary/50'
                              )}
                              onClick={() => field.onChange(plan.Id)}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium">
                                  {plan.Name.charAt(0).toUpperCase() +
                                    plan.Name.slice(1)}
                                </h3>
                                <span
                                  className={cn(
                                    'text-sm font-medium px-2.5 py-0.5 rounded-full',
                                    plan.MonthlyPrice === 0
                                      ? 'bg-green-500/10 text-green-600'
                                      : 'bg-primary/10 text-primary'
                                  )}
                                >
                                  {plan.MonthlyPrice === 0
                                    ? 'Free'
                                    : `${plan.MonthlyPrice} BDT/month`}
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="link"
                                className="text-xs p-0 h-auto w-fit flex items-center gap-1.5 text-muted-foreground hover:text-primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(
                                    'https://suprasy.com/pricing',
                                    '_blank'
                                  );
                                }}
                              >
                                <Link2 className="h-3 w-3" />
                                View plan details
                              </Button>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {selectedPlan &&
                  selectedPlan.MonthlyPrice > 0 &&
                  !haveBalance && (
                    <Alert variant="destructive" className="mx-0">
                      <AlertTitle className="text-sm font-medium">
                        Insufficient Balance
                      </AlertTitle>
                      <AlertDescription className="flex items-center justify-between mt-1">
                        <span className="text-sm">
                          You need{' '}
                          <span className="font-medium">
                            {selectedPlan.MonthlyPrice -
                              (balanceResponse?.Data?.Balance || 0)}{' '}
                            BDT
                          </span>{' '}
                          more to create store with this plan
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAddBalanceModal(true)}
                          className="gap-1.5 h-8 text-xs"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Add Balance
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}

                {balanceSuccess &&
                  balance &&
                  planResponse?.Data &&
                  selectedPlan && (
                    <div className="space-y-4">
                      <Alert className="bg-card border shadow-sm">
                        <AlertTitle className="text-sm font-medium">
                          Transaction Details
                        </AlertTitle>
                        <AlertDescription className="text-sm mt-2">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Monthly Cost:
                              </span>
                              <span className="font-medium">
                                {selectedPlan.MonthlyPrice} BDT
                              </span>
                            </div>
                            {selectedPlan.MonthlyPrice > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Remaining Balance:
                                </span>
                                <span className="font-medium">
                                  {balance.Balance - selectedPlan.MonthlyPrice}{' '}
                                  BDT
                                </span>
                              </div>
                            )}
                          </div>
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
              </div>

              <div className="p-6 border-t space-y-3 bg-muted/5">
                <Button
                  type="submit"
                  className="w-full h-10 font-medium"
                  disabled={isPending}
                >
                  {isPending ? 'Creating Store...' : 'Create Store'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  className="w-full h-10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>

      <AddBalanceModal
        isOpen={showAddBalanceModal}
        onClose={() => setShowAddBalanceModal(false)}
      />
    </Dialog>
  );
};

export default CreateStoreModal;
