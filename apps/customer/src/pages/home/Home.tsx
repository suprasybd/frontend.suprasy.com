import { Badge, Button } from '@customer/components/index';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getUserBalance, getUserStoresList } from './api';

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
      <div className="grid grid-cols-1">
        {storeList?.Data?.map((store) => (
          <Card key={store.Id} className="my-5">
            <CardHeader>
              <CardTitle>{store.StoreName}</CardTitle>
              <CardDescription>
                <div>
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
            <CardContent>
              <div>
                <p className="break-words">Store Key: {store.StoreKey}</p>
                <p>
                  {' '}
                  Site Link:{' '}
                  <a
                    className="underline text-blue-500"
                    href={`http://${store.SubDomain}.suprasy.com`}
                    target="__blank"
                  >{`https://${store.SubDomain}.suprasy.com`}</a>
                </p>
              </div>
            </CardContent>
            <CardFooter>
              {store.IsActive && (
                <Link
                  className="underline underline-offset-4"
                  to={'/store/$storeKey/dashboard'}
                  params={{ storeKey: store.StoreKey }}
                >
                  View Dashboard ({store.StoreName})
                </Link>
              )}
              {!store.IsActive && (
                <p>
                  Your website subscription has expired you can't view the
                  dashboard, but your website is still actively running and
                  functional. To gain access to dashbaord please renew
                  subscription.
                </p>
              )}

              {!store.IsActive && (
                <Button
                  className="my-3"
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
            </CardFooter>
          </Card>
        ))}
      </div>
      {!storeList?.Data.length && <p>Not stores found!</p>}
    </section>
  );
};

export default Home;
