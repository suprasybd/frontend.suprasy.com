import { Badge, Button } from '@frontend.suprasy.com/ui';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getUserStoresList } from './api';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@frontend.suprasy.com/ui';
import { LoaderMain } from '../../components/Loader/Loader';
import { Link } from '@tanstack/react-router';
import { useModalStore } from '@customer/store/modalStore';

const Home: React.FC = () => {
  const { data: storeList, isLoading } = useQuery({
    queryKey: ['getUserStoresList'],
    queryFn: getUserStoresList,
  });

  const { setModalPath } = useModalStore((state) => state);

  return (
    <section className="w-full max-w-[94rem] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
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
          <Card key={store.Id}>
            <CardHeader>
              <CardTitle>{store.StoreName}</CardTitle>
              <CardDescription>
                <div>
                  <span className="mr-2">Site Status</span>
                  {store.IsActive && <Badge variant="secondary">Active</Badge>}
                  {!store.IsActive && <Badge variant="destructive">Down</Badge>}
                </div>
                <div className="mt-2">
                  <span className="mr-2">Deployment Status</span>
                  <Badge variant="secondary">{store.Status}</Badge>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <p className="break-words">Store Key: {store.StoreKey}</p>
                <p>
                  <span className="mr-2">Active Subdomain:</span>
                  <a
                    className="text-blue-600 hover:underline"
                    rel="noreferrer"
                    target="_blank"
                    href={`https://${store.StoreName}.mysuprasy.com`}
                  >
                    {store.StoreName}.mysuprasy.com
                  </a>
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Link
                className="underline underline-offset-4"
                to={'/store/$storeKey/dashboard'}
                params={{ storeKey: store.StoreKey }}
              >
                View Dashboard ({store.StoreName})
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      {!storeList?.Data.length && <p>Not stores found!</p>}
    </section>
  );
};

export default Home;
