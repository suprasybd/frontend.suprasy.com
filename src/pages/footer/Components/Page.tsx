import React from 'react';

import { Button } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import { Plus, FileText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { getAllPage } from '../api';
import { pageColumns } from './pageColumns';
import { DataTable } from '@/components/Table/table';
import { LoaderMain } from '@/components/Loader/Loader';

const Page = () => {
  const { storeKey } = useParams({ strict: false }) as {
    storeKey: string;
  };

  const { data: pageResponse, isLoading } = useQuery({
    queryKey: ['getPagesAll'],
    queryFn: getAllPage,
  });

  const page = pageResponse?.Data;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button asChild>
          <Link
            to="/store/$storeKey/footer/createpage"
            params={{ storeKey }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Page
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      {!isLoading && page && page?.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <div className="space-y-3">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto" />
              <h3 className="font-semibold text-lg">No Pages Found</h3>
              <p className="text-muted-foreground text-sm">
                Create your first custom page to get started
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && page && page?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Custom Pages</CardTitle>
            <CardDescription>
              Manage your store's additional pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={pageColumns} data={page || []} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Page;
