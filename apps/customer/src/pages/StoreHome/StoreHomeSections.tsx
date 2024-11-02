import React, { useEffect, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  Button,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  useToast,
  RichTextRender,
} from '@customer/components/index';

import { Link, useParams } from '@tanstack/react-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  deleteSection,
  getHomeSections,
  getHomesectionsProducts,
  getSectionById,
} from './api';
import { useProductSelectionStore } from '@customer/store/productSelection';
import { ProductCard } from '@customer/components/Modals/ProductSelection/ProductSelection';

export const formSchemaHomesection = z.object({
  Title: z.string().min(2).max(50),
  Description: z.string().min(2).max(300),
  Products: z.array(z.object({ ProductId: z.coerce.number().min(0) })),
});

const StoreHome = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };
  const [sectionId, setSectionId] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchemaHomesection>>({
    resolver: zodResolver(formSchemaHomesection),
    defaultValues: {},
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'Products',
  });

  const { Product } = useProductSelectionStore((state) => state);

  const { toast } = useToast();

  const {
    data: homeSectionsResponse,
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['getHomeSections', storeKey],
    queryFn: () => getHomeSections(),
    enabled: !!storeKey,
  });

  const { data: sectionResponse } = useQuery({
    queryKey: ['getSectionById', sectionId, storeKey],
    queryFn: () => getSectionById(sectionId),
    enabled: !!sectionId && isUpdating && !!storeKey,
  });

  const { data: sectionProductsResponse } = useQuery({
    queryKey: ['getSectionProductsByIdForUpdate', sectionId, storeKey],
    queryFn: () => getHomesectionsProducts(sectionId),
    enabled: !!sectionId && isUpdating && !!storeKey,
  });

  const section = sectionResponse?.Data;
  const sectionProducts = sectionProductsResponse?.Data;
  console.log('section products out', sectionProducts);
  useEffect(() => {
    if (section) {
      form.setValue('Title', section?.Title);
      form.setValue('Description', section?.Description);
    }

    if (sectionProducts && sectionProducts.length > 0) {
      const formatedP = sectionProducts.map((pro) => ({
        ProductId: pro.ProductId,
      }));
      console.log('section products formated', formatedP);
      form.setValue('Products', formatedP);
    }
  }, [section, sectionProducts]);

  const { mutate: handleDeleteSection } = useMutation({
    mutationFn: deleteSection,
    onSuccess: () => {
      refetch();
      toast({
        title: 'home section delete',
        description: 'home section delete successfull',
        variant: 'default',
      });
    },
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'home section delete',
        description: response.response.data.Message,
        variant: 'destructive',
      });
    },
  });

  const homeSesctions = homeSectionsResponse?.Data;

  useEffect(() => {
    if (Product) {
      append({ ProductId: Product });
    }
    // eslint-disable-next-line
  }, [Product]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4">
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <Card className="my-10 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">
              Failed to load sections. Please try again.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Empty state with better styling */}
      {!isLoading && homeSesctions?.length === 0 && (
        <Card className="my-10">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">No sections found</h2>
            <p className="text-muted-foreground mb-4">
              Create your first section to get started
            </p>
            <Button asChild>
              <Link to="/store/$storeKey/section/create" params={{ storeKey }}>
                Create Section
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Sections list with improved styling */}
      {homeSesctions && homeSesctions.length > 0 && (
        <Card className="my-10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Sections List</CardTitle>
            <Button asChild>
              <Link to="/store/$storeKey/section/create" params={{ storeKey }}>
                Add Section
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-6">
            {homeSesctions.map((section) => (
              <Card key={section.Id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{section.Title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <RichTextRender
                      initialVal={section.Description}
                      classname="!h-fit"
                    />
                  </div>

                  <SectionProducts sectionId={section.Id} />

                  <div className="flex gap-2">
                    <Button asChild variant="outline">
                      <Link
                        to="/store/$storeKey/section/create"
                        search={{ update: true, sectionId: section.Id }}
                        params={{ storeKey }}
                      >
                        Edit Section
                      </Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Remove Section</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your section and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="p-0">
                            <Button
                              className="my-5"
                              variant={'destructive'}
                              onClick={() => {
                                handleDeleteSection(section.Id);
                              }}
                            >
                              Confirm Remove
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </section>
  );
};

const SectionProducts: React.FC<{ sectionId: number }> = ({ sectionId }) => {
  const { data: sectionProductsResponse, isLoading } = useQuery({
    queryKey: ['getSectionsProducts', sectionId],
    queryFn: () => getHomesectionsProducts(sectionId),
    enabled: !!sectionId,
  });

  const sectionProducts = sectionProductsResponse?.Data;

  if (isLoading) {
    return (
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-[200px] h-[160px] bg-muted animate-pulse rounded-md"
          />
        ))}
      </div>
    );
  }

  if (!sectionProducts?.length) {
    return (
      <p className="text-muted-foreground text-sm">
        No products in this section
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {sectionProducts.map((product) => (
        <ProductCard
          key={product.ProductId}
          ProductId={product.ProductId}
          compact
          showActions
        />
      ))}
    </div>
  );
};

export default StoreHome;
