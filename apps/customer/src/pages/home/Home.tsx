import { Badge } from '@frontend.suprasy.com/ui';
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

const Home: React.FC = () => {
  const { data: storeList, isLoading } = useQuery({
    queryKey: ['getUserStoresList'],
    queryFn: getUserStoresList,
  });
  return (
    <section className="w-full max-w-[94rem] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <h1 className="text-xl my-4">Stores</h1>

      {isLoading && <LoaderMain />}
      <div className="flex gap-4 flex-wrap">
        {storeList?.Data?.map((store) => (
          <Card key={store.Id}>
            <CardHeader>
              <CardTitle>{store.StoreName}</CardTitle>
              <CardDescription>
                <span className="mr-2">Site Status</span>
                {store.IsActive && <Badge variant="secondary">Active</Badge>}
                {!store.IsActive && <Badge variant="destructive">Down</Badge>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <p>Store Key: {store.StoreKey}</p>
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
    </section>
  );
};

export default Home;
