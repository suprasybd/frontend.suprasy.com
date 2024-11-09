import React, { useState } from 'react';
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
import SubscriptionActionModal from '@/components/Modals/SubscriptionActionModal/SubscriptionActionModal';
import AddBalanceModal from '@/components/Modals/AddBalanceModal/AddBalanceModal';
import { ExternalLink, Crown, Sparkles, Rocket, Gift } from 'lucide-react';

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

  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showAddBalanceModal, setShowAddBalanceModal] = useState(false);

  const handleSubscriptionAction = (plan: PlanType) => {
    setSelectedPlan(plan);
    setShowActionModal(true);
  };

  const handleConfirmAction = () => {
    if (selectedPlan) {
      handleRenew({
        StoreKey: storeKey,
        planId: selectedPlan.Id,
      });
      setShowActionModal(false);
    }
  };

  const isCurrentPlan = (planId: number) => {
    return planId === currentSubscription?.PlanId;
  };

  const isPaidPlan = (plan: PlanType) => {
    return plan.MonthlyPrice > 0;
  };

  const getPlanDetails = (planName?: string) => {
    switch (planName?.toLowerCase()) {
      case 'enterprise':
        return {
          icon: <Rocket className="h-5 w-5 text-violet-500" />,
          className:
            'border-violet-200 hover:border-violet-300 bg-gradient-to-br from-violet-50/50 to-purple-50/50',
          badgeClass: 'bg-violet-100 text-violet-700',
          titleClass: 'text-violet-700',
          checkmarkClass: 'text-violet-500',
        };
      case 'pro':
        return {
          icon: <Crown className="h-5 w-5 text-amber-500" />,
          className:
            'border-amber-200 hover:border-amber-300 bg-gradient-to-br from-amber-50/50 to-yellow-50/50',
          badgeClass: 'bg-amber-100 text-amber-700',
          titleClass: 'text-amber-700',
          checkmarkClass: 'text-amber-500',
        };
      case 'starter':
        return {
          icon: <Sparkles className="h-5 w-5 text-blue-500" />,
          className:
            'border-blue-200 hover:border-blue-300 bg-gradient-to-br from-blue-50/50 to-cyan-50/50',
          badgeClass: 'bg-blue-100 text-blue-700',
          titleClass: 'text-blue-700',
          checkmarkClass: 'text-blue-500',
        };
      default:
        return {
          icon: <Gift className="h-5 w-5 text-gray-500" />,
          className: 'border-gray-200 hover:border-gray-300',
          badgeClass: 'bg-gray-100 text-gray-700',
          titleClass: 'text-gray-700',
          checkmarkClass: 'text-gray-500',
        };
    }
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
        {plans.map((plan) => {
          const planStyle = getPlanDetails(plan.Name);

          return (
            <Card
              key={plan.Id}
              className={cn(
                'relative transition-all hover:shadow-lg',
                planStyle.className,
                isCurrentPlan(plan.Id) && 'ring-2 ring-primary ring-offset-2'
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
                <div className="flex items-center gap-2 mb-2">
                  {planStyle.icon}
                  <CardTitle className={cn('capitalize', planStyle.titleClass)}>
                    {plan.Name}
                  </CardTitle>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <span
                    className={cn(
                      'font-medium text-base',
                      planStyle.titleClass
                    )}
                  >
                    {plan.MonthlyPrice > 0
                      ? `${plan.MonthlyPrice} BDT/month`
                      : 'Free'}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {getPlanFeatures(plan.Features).map(
                    (feature: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <span
                          className={cn('mr-2 mt-1', planStyle.checkmarkClass)}
                        >
                          ✓
                        </span>
                        {feature}
                      </li>
                    )
                  )}
                </ul>

                {isCurrentPlan(plan.Id) ? (
                  isPaidPlan(plan) ? (
                    <Button
                      className="w-full"
                      disabled={isPending}
                      onClick={() => handleSubscriptionAction(plan)}
                    >
                      {isPending ? 'Processing...' : 'Add More Months'}
                    </Button>
                  ) : null
                ) : isPaidPlan(plan) ? (
                  <Button
                    className="w-full"
                    variant="default"
                    disabled={isPending}
                    onClick={() => handleSubscriptionAction(plan)}
                  >
                    {isPending ? 'Processing...' : `Upgrade to ${plan.Name}`}
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
      {/* Insufficient Balance Warning */}
      {!canRenew &&
        currentPlan?.MonthlyPrice &&
        currentPlan.MonthlyPrice > 0 && (
          <Alert variant="destructive">
            <AlertTitle>Insufficient Balance</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>
                Please add more funds to your account to upgrade or renew your
                subscription.
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddBalanceModal(true)}
                className="mt-2 gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Add Balance
              </Button>
            </AlertDescription>
          </Alert>
        )}

      {/* Add the AddBalanceModal */}
      <AddBalanceModal
        isOpen={showAddBalanceModal}
        onClose={() => setShowAddBalanceModal(false)}
      />

      {/* Add the modal */}
      {selectedPlan && (
        <SubscriptionActionModal
          isOpen={showActionModal}
          onClose={() => setShowActionModal(false)}
          onConfirm={handleConfirmAction}
          selectedPlan={selectedPlan}
          currentBalance={balance}
          isPending={isPending}
          isUpgrade={selectedPlan.Id !== currentSubscription?.PlanId}
          onAddBalance={() => setShowAddBalanceModal(true)}
        />
      )}
    </div>
  );
};

export default Subscription;
