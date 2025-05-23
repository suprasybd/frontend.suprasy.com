import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
} from '@/components/index';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import {
  getSubDetails,
  getUserBalance,
  getUserStoresList,
  getSubscriptionList,
  getPlan,
  getTransactions,
} from './api';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/index';
import { LoaderMain } from '../../components/Loader/Loader';
import { Link } from '@tanstack/react-router';
import { useModalStore } from '@/store/modalStore';
import { StoreType, TransactionType } from './api/types';
import { Key, StoreIcon, Terminal } from 'lucide-react';
import cn from 'classnames';
import {
  Plus,
  Link2,
  Calendar,
  AlertTriangle,
  LayoutDashboard,
} from 'lucide-react';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { useToast } from '@/components/ui/use-toast';
import { CreditCard } from 'lucide-react';
import { ExternalLink } from 'lucide-react';
import AddBalanceModal from '@/components/Modals/AddBalanceModal/AddBalanceModal';
import { format } from 'date-fns';
import { ArrowLeft, ArrowRight, Receipt } from 'lucide-react';
import { Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Crown, Sparkles, Rocket, Gift } from 'lucide-react';

const Home: React.FC = () => {
  const [showAddBalanceModal, setShowAddBalanceModal] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: storeList, isLoading } = useQuery({
    queryKey: ['getUserStoresList'],
    queryFn: getUserStoresList,
  });

  const { data: balanceResponse, isLoading: balanceLoading } = useQuery({
    queryKey: ['getUserBalance'],
    queryFn: getUserBalance,
  });

  const balance = balanceResponse?.Data.Balance;
  const { setModalPath } = useModalStore((state) => state);

  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions', page, limit],
    queryFn: () => getTransactions(page, limit),
  });

  useEffect(() => {
    document.body.style.overflow = 'auto';
  }, []);

  return (
    <section className="w-full min-h-[90vh] overflow-auto max-w-[94rem] mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">My Stores</h1>
          <Badge variant="secondary" className="h-6">
            {storeList?.Data?.length || 0} stores
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          {!balanceLoading && (
            <div className="flex items-center gap-2 bg-muted/40 px-4 py-2 rounded-lg">
              <span className="text-muted-foreground">Balance:</span>
              <span className="font-medium">{balance?.toFixed(2)} BDT/৳</span>
            </div>
          )}

          <Button
            onClick={(e) => {
              e.preventDefault();
              setModalPath({ modal: 'create-store' });
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Store
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowAddBalanceModal(true)}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Add Balance
          </Button>
        </div>
      </div>

      {isLoading ? (
        <LoaderMain />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storeList?.Data?.map((store) => (
            <StoreCard key={store.Id} store={store} />
          ))}
        </div>
      )}

      {!isLoading && !storeList?.Data?.length && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <StoreIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No stores found</h3>
          <p className="text-muted-foreground text-center mb-6">
            Get started by creating your first store
          </p>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setModalPath({ modal: 'create-store' });
            }}
          >
            Create Your First Store
          </Button>
        </div>
      )}

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">Recent Transactions</h2>
            <Receipt className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <Card>
          {transactionsLoading ? (
            <div className="p-8 flex justify-center">
              <LoaderMain />
            </div>
          ) : (
            <>
              <div className="divide-y">
                {transactionsData?.Data.map((transaction: TransactionType) => (
                  <div
                    key={transaction.Id}
                    className="p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'p-2 rounded-full',
                            transaction.Type === 'CREDIT'
                              ? 'bg-green-500/10'
                              : 'bg-red-500/10'
                          )}
                        >
                          {transaction.Type === 'CREDIT' ? (
                            <ArrowDownLeft
                              className={cn(
                                'h-5 w-5',
                                transaction.Type === 'CREDIT'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              )}
                            />
                          ) : (
                            <ArrowUpRight
                              className={cn(
                                'h-5 w-5',
                                transaction.Type === 'DEBIT'
                                  ? 'text-red-600'
                                  : 'text-green-600'
                              )}
                            />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {transaction.Description ||
                              (transaction.Type === 'CREDIT'
                                ? 'Balance Added'
                                : 'Balance Deducted')}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              {format(
                                new Date(transaction.CreatedAt),
                                'dd MMM yyyy, hh:mm a'
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={cn(
                          'font-medium',
                          transaction.Type === 'CREDIT'
                            ? 'text-green-600'
                            : 'text-red-600'
                        )}
                      >
                        {transaction.Type === 'CREDIT' ? '+' : '-'}{' '}
                        {transaction.Amount} BDT
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {transactionsData?.Pagination && (
                <div className="flex items-center justify-between p-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {(page - 1) * limit + 1} to{' '}
                    {Math.min(
                      page * limit,
                      transactionsData.Pagination.TotalItems
                    )}{' '}
                    of {transactionsData.Pagination.TotalItems} transactions
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page === transactionsData.Pagination.TotalPages}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!transactionsData?.Data.length && (
                <div className="flex flex-col items-center justify-center py-8">
                  <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No transactions yet
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Your transaction history will appear here
                  </p>
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      <AddBalanceModal
        isOpen={showAddBalanceModal}
        onClose={() => setShowAddBalanceModal(false)}
      />
    </section>
  );
};

const StoreCard: React.FC<{ store: StoreType }> = ({ store }) => {
  const { toast } = useToast();
  const { data: subResponse } = useQuery({
    queryKey: ['getStoreSub', store.StoreKey],
    queryFn: () => getSubDetails(store.StoreKey),
  });

  const subData = subResponse?.Data;
  const { setModalPath } = useModalStore((state) => state);

  const mainSubDomain = `http://${store.SubDomain}.suprasy.com`;
  const backupSubDomain = `http://${store.SubDomain.replace('store-', '')}${
    store.StoreKey
  }.b-cdn.net`;

  const checkDomainAvailability = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        img.src = ''; // Cancel image request
        resolve(false);
      }, 5000); // 5 second timeout

      img.onload = () => {
        clearTimeout(timeout);
        resolve(true);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };

      // Try to load favicon or a known image path
      img.src = `${url}/favicon.ico?${new Date().getTime()}`;
    });
  };

  const handleVisitStore = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      // Always open in new tab first, then check availability
      const win = window.open('about:blank', '_blank');

      // Check main domain
      const isMainDomainLive = await checkDomainAvailability(mainSubDomain);
      if (isMainDomainLive) {
        win?.location.replace(mainSubDomain);
        return;
      }

      // Check backup domain
      const isBackupDomainLive = await checkDomainAvailability(backupSubDomain);
      if (isBackupDomainLive) {
        win?.location.replace(backupSubDomain);
        return;
      }

      // If neither domain is live, close the blank window and show error
      win?.close();
      toast({
        title: 'Store Unavailable',
        description:
          'Your store is still being set up. Please try again in a few minutes.',
        variant: 'destructive',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to check store availability. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const { data: subscriptionResponse } = useQuery({
    queryKey: ['getSubscriptionList', store.StoreKey],
    queryFn: () => getSubscriptionList(store.StoreKey),
  });

  const { data: planResponse } = useQuery({
    queryKey: ['getPlan'],
    queryFn: getPlan,
  });

  const subscription = subscriptionResponse?.Data;
  const plans = planResponse?.Data || [];

  // Find current plan details
  const currentPlan = plans.find((plan) => plan.Id === subscription?.PlanId);

  // Format subscription end date
  const getSubscriptionEndDate = () => {
    if (!subscription) return 'No subscription';
    if (!subscription.EndDate) return 'Lifetime Access';
    return format(new Date(subscription.EndDate), 'dd MMM yyyy');
  };

  const getPlanDetails = (planName?: string) => {
    switch (planName?.toLowerCase()) {
      case 'enterprise':
        return {
          icon: <Rocket className="h-4 w-4 text-violet-500" />,
          className:
            'border-violet-200 hover:border-violet-300 bg-gradient-to-br from-violet-50/50 to-purple-50/50',
          badgeClass: 'bg-violet-100 text-violet-700',
          titleClass: 'text-violet-700',
        };
      case 'pro':
        return {
          icon: <Crown className="h-4 w-4 text-amber-500" />,
          className:
            'border-amber-200 hover:border-amber-300 bg-gradient-to-br from-amber-50/50 to-yellow-50/50',
          badgeClass: 'bg-amber-100 text-amber-700',
          titleClass: 'text-amber-700',
        };
      case 'starter':
        return {
          icon: <Sparkles className="h-4 w-4 text-blue-500" />,
          className:
            'border-blue-200 hover:border-blue-300 bg-gradient-to-br from-blue-50/50 to-cyan-50/50',
          badgeClass: 'bg-blue-100 text-blue-700',
          titleClass: 'text-blue-700',
        };
      default:
        return {
          icon: <Gift className="h-4 w-4 text-gray-500" />,
          className: 'border-gray-200 hover:border-gray-300',
          badgeClass: 'bg-gray-100 text-gray-700',
          titleClass: 'text-gray-700',
        };
    }
  };

  const planStyle = getPlanDetails(currentPlan?.Name);

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all hover:shadow-lg',
        planStyle.className
      )}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {planStyle.icon}
              <CardTitle className={cn('text-xl', planStyle.titleClass)}>
                {store.StoreName}
              </CardTitle>
            </div>
            <CardDescription className="flex items-center gap-2">
              {store.IsActive ? (
                <Badge
                  variant="secondary"
                  className={cn('px-2 py-0.5', planStyle.badgeClass)}
                >
                  {currentPlan?.Name
                    ? currentPlan.Name.charAt(0).toUpperCase() +
                      currentPlan.Name.slice(1)
                    : 'Free'}{' '}
                  Plan • Active
                </Badge>
              ) : (
                <Badge variant="destructive" className="px-2 py-0.5">
                  Subscription Expired
                </Badge>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-muted-foreground" />
            <a
              href="#"
              onClick={handleVisitStore}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Visit Store
            </a>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Key className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Store Key:</span>
            <span className="font-medium">{store.StoreKey}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Subscription:</span>
            <span className="font-medium">
              {currentPlan?.Name || 'Unknown Plan'} - {getSubscriptionEndDate()}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <>
          <Link
            to="/store/$storeKey/dashboard"
            params={{ storeKey: store.StoreKey }}
            className="w-full"
          >
            <Button
              className="flex items-center gap-2 w-full"
              variant="default"
            >
              <LayoutDashboard className="h-4 w-4" />
              View Dashboard
            </Button>
          </Link>
          <Link
            to="/store/$storeKey/subscription"
            params={{ storeKey: store.StoreKey }}
            className="w-full"
          >
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full"
            >
              <CreditCard className="h-4 w-4" />
              Manage Subscription
            </Button>
          </Link>
        </>
      </CardFooter>
    </Card>
  );
};

export default Home;
