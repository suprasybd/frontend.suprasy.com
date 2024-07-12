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
import { Terminal } from 'lucide-react';
import cn from 'classnames';

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
    <section className="w-full h-[90vh] overflow-auto max-w-[94rem] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      {/* show balance */}

      {!balanceLoading && (
        <div className="w-full text-right">
          Balance: {balance?.toFixed(2)} (BDT/৳)
        </div>
      )}

      <Button
        onClick={(e) => {
          e.preventDefault();
          setModalPath({ modal: 'create-store' });
        }}
        className="my-3"
      >
        Create Store
      </Button>
      <h1 className="text-xl my-4">Stores</h1>

      {isLoading && <LoaderMain />}
      <div className="flex flex-wrap gap-[10px] justify-start items-start">
        {storeList?.Data?.map((store) => (
          <StoreCard store={store} />
        ))}
      </div>
      {!storeList?.Data.length && <p>Not stores found!</p>}
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
    <div>
      <Card
        key={store.Id}
        className={cn(
          'my-5 w-full md:w-[400px] ',
          store.IsActive && 'h-[300px]'
        )}
      >
        <CardHeader>
          <CardTitle>{store.StoreName}</CardTitle>
          <CardDescription>
            <div className="mt-3">
              <span className="mr-2">Site Status</span>
              {store.IsActive && <Badge variant="secondary">Active</Badge>}
              {!store.IsActive && (
                <Badge variant="destructive">
                  Subscription Expired (Site is still active)
                </Badge>
              )}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5">
          <div>
            <p className="break-words text-sm">Store Key: {store.StoreKey}</p>
            <p className="text-sm my-2">
              {' '}
              Site Link:{' '}
              <a
                className="underline text-blue-500"
                href={`http://${store.SubDomain}.suprasy.com`}
                target="__blank"
              >{`https://${store.SubDomain}.suprasy.com`}</a>
            </p>
            <p className="text-sm my-2">
              Subscription Will Expire At: {subData?.EndDate}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <div>
            {store.IsActive && (
              <Button className="w-full">
                <Link
                  to={'/store/$storeKey/dashboard'}
                  params={{ storeKey: store.StoreKey }}
                >
                  View Dashboard ({store.StoreName})
                </Link>
              </Button>
            )}
          </div>

          <div>
            {!store.IsActive && (
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  Your website subscription has expired you can't view the
                  dashboard, but your website is still actively running and
                  functional. To gain access to dashboard please renew
                  subscription.
                </AlertDescription>
              </Alert>
            )}

            {!store.IsActive && (
              <Button
                className="my-3 w-full"
                onClick={() => {
                  setModalPath({
                    modal: 'renew-store',
                    storeKey: store.StoreKey,
                  });
                }}
              >
                Renew Subscription
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Home;
