import React from 'react';
import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import {
  getPlan,
  getUserBalance,
  getSubscriptionList,
  renewSubscription,
} from '@/pages/home/api';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/components/index';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/index';
import { cn } from '@/libs/utils';
import { PlanType } from '../home/api/types';

const Subscription = () => {
  const { storeKey } = useParams({ from: '/store/$storeKey/subscription' });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subscriptionResponse } = useQuery({
    queryKey: ['getSubscriptionList', storeKey],
    queryFn: () => getSubscriptionList(storeKey),
  });

  const { data: planResponse } = useQuery({
    queryKey: ['getPlan'],
    queryFn: getPlan,
  });

  const { data: balanceResponse } = useQuery({
    queryKey: ['getUserBalance'],
    queryFn: getUserBalance,
  });

  const { mutate: handleRenew, isPending } = useMutation({
    mutationFn: renewSubscription,
    onSuccess: () => {
      toast({
        title: 'Subscription Renewed',
        description: 'Your subscription has been renewed successfully',
        variant: 'default',
      });
      queryClient.invalidateQueries({ queryKey: ['getSubscriptionList'] });
      queryClient.invalidateQueries({ queryKey: ['getUserStoresList'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.Message || 'Something went wrong',
        variant: 'destructive',
      });
    },
  });

  const currentSubscription = subscriptionResponse?.Data;
  const plans = planResponse?.Data || [];
  const balance = balanceResponse?.Data?.Balance || 0;

  const currentPlan = plans.find(
    (plan) => plan.Id === currentSubscription?.PlanId
  );

  const canRenew = balance >= (currentPlan?.MonthlyPrice || 0);

  const getPlanFeatures = (featuresString: string) => {
    try {
      return JSON.parse(featuresString);
    } catch {
      return [];
    }
  };

  const handleSubscriptionAction = (planId: number) => {
    handleRenew({
      StoreKey: storeKey,
      planId: planId,
    });
  };

  const isCurrentPlan = (planId: number) => {
    return planId === currentSubscription?.PlanId;
  };

  const isPaidPlan = (plan: PlanType) => {
    return plan.MonthlyPrice > 0;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Subscription Management</h1>

      {/* Current Subscription Card */}
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
          <CardDescription>
            Your current subscription details and status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentSubscription ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="font-medium">
                    {currentPlan?.Name || 'Unknown Plan'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">
                    {currentPlan?.MonthlyPrice} BDT/month
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">
                    {format(
                      new Date(currentSubscription.StartDate),
                      'dd MMM yyyy'
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">
                    {currentSubscription.EndDate
                      ? format(
                          new Date(currentSubscription.EndDate),
                          'dd MMM yyyy'
                        )
                      : 'Lifetime Access'}
                  </p>
                </div>
              </div>

              {/* Current Balance Info */}
              <Alert>
                <AlertTitle>Current Balance</AlertTitle>
                <AlertDescription>
                  Your current balance: {balance} BDT
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <p>No subscription found</p>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.Id}
            className={cn(
              'relative',
              isCurrentPlan(plan.Id) && 'border-primary shadow-md'
            )}
          >
            {isCurrentPlan(plan.Id) && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                  Current Plan
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.Name}</CardTitle>
              <CardDescription>
                {plan.MonthlyPrice > 0
                  ? `${plan.MonthlyPrice} BDT/month`
                  : 'Free'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {getPlanFeatures(plan.Features).map(
                  (feature: string, idx: number) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2 mt-1 text-primary">✓</span>
                      {feature}
                    </li>
                  )
                )}
              </ul>

              {isCurrentPlan(plan.Id) ? (
                isPaidPlan(plan) ? (
                  <Button
                    className="w-full"
                    disabled={!canRenew || isPending}
                    onClick={() => handleSubscriptionAction(plan.Id)}
                  >
                    {isPending ? 'Processing...' : 'Add More Months'}
                  </Button>
                ) : null
              ) : (
                <Button
                  className="w-full"
                  variant={isPaidPlan(plan) ? 'default' : 'secondary'}
                  disabled={!canRenew || isPending}
                  onClick={() => handleSubscriptionAction(plan.Id)}
                >
                  {isPending
                    ? 'Processing...'
                    : isPaidPlan(plan)
                    ? `Upgrade to ${plan.Name}`
                    : 'Switch to Free Plan'}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Insufficient Balance Warning */}
      {!canRenew &&
        currentPlan?.MonthlyPrice &&
        currentPlan.MonthlyPrice > 0 && (
          <Alert variant="destructive">
            <AlertTitle>Insufficient Balance</AlertTitle>
            <AlertDescription>
              Please add more funds to your account to upgrade or renew your
              subscription.
            </AlertDescription>
          </Alert>
        )}
    </div>
  );
};

export default Subscription;
