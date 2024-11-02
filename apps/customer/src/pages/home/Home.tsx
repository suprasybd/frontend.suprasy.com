import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
} from '@customer/components/index';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getSubDetails, getUserBalance, getUserStoresList } from './api';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@customer/components/index';
import { LoaderMain } from '../../components/Loader/Loader';
import { Link } from '@tanstack/react-router';
import { useModalStore } from '@customer/store/modalStore';
import { StoreType } from './api/types';
import { Key, StoreIcon, Terminal } from 'lucide-react';
import cn from 'classnames';
import {
  Plus,
  Link2,
  Calendar,
  AlertTriangle,
  LayoutDashboard,
} from 'lucide-react';

const Home: React.FC = () => {
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
    </section>
  );
};

const StoreCard: React.FC<{ store: StoreType }> = ({ store }) => {
  const { data: subResponse } = useQuery({
    queryKey: ['getStoreSub', store.StoreKey],
    queryFn: () => getSubDetails(store.StoreKey),
  });

  const subData = subResponse?.Data;
  const { setModalPath } = useModalStore((state) => state);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-2">{store.StoreName}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              {store.IsActive ? (
                <Badge variant="secondary" className="px-2 py-0.5">
                  Active
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
              href={`https://${store.SubDomain}.suprasy.com`}
              target="_blank"
              rel="noopener noreferrer"
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
            <span className="text-muted-foreground">Expires:</span>
            <span className="font-medium">{subData?.EndDate}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        {store.IsActive ? (
          <Button className="w-full" variant="default">
            <Link
              to="/store/$storeKey/dashboard"
              params={{ storeKey: store.StoreKey }}
              className="flex items-center gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              View Dashboard
            </Link>
          </Button>
        ) : (
          <>
            <Alert variant="destructive" className="mb-3">
              <AlertTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Subscription Expired
              </AlertTitle>
              <AlertDescription className="mt-2 text-sm">
                Your website is still running but dashboard access is
                restricted. Please renew your subscription to regain access.
              </AlertDescription>
            </Alert>
            <Button
              className="w-full"
              onClick={() =>
                setModalPath({
                  modal: 'renew-store',
                  storeKey: store.StoreKey,
                })
              }
            >
              Renew Subscription
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default Home;
