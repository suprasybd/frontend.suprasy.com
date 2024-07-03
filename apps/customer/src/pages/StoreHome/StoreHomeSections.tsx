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

  const { data: homeSectionsResponse, refetch } = useQuery({
    queryKey: ['getHomeSections'],
    queryFn: () => getHomeSections(),
  });

  const { data: sectionResponse } = useQuery({
    queryKey: ['getSectionById', sectionId],
    queryFn: () => getSectionById(sectionId),
    enabled: !!sectionId && isUpdating,
  });

  const { data: sectionProductsResponse } = useQuery({
    queryKey: ['getSectionProductsByIdForUpdate', sectionId],
    queryFn: () => getHomesectionsProducts(sectionId),
    enabled: !!sectionId && isUpdating,
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
    onError: () => {
      toast({
        title: 'home section delete',
        description: 'home section delete failed',
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
    <section className="w-full">
      {/* create section */}

      {/* home sections */}
      <Card className="my-10">
        <CardHeader>
          <CardTitle>
            {' '}
            <h1 className="my-4 font-bold text-xl">Sections List</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {homeSesctions &&
            homeSesctions.length > 0 &&
            homeSesctions.map((section) => (
              <div className="p-5 border my-2 border-gray-300 rounded-md">
                <h1 className="text-4xl font-medium">{section.Title}</h1>
                <RichTextRender initialVal={section.Description} />

                <SectionProducts sectionId={section.Id} />

                <AlertDialog>
                  <AlertDialogTrigger>
                    {' '}
                    <Button className="my-5" variant={'destructive'}>
                      Remove Section
                    </Button>
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

                <Button
                  className="my-5 mx-2"
                  onClick={() => {
                    // form.setValue('Products', []);
                    // setSectionId(section.Id);
                    // setIsUpdating(true);
                  }}
                >
                  <Link
                    to="/store/$storeKey/section/create"
                    search={{ update: true, sectionId: section.Id }}
                    params={{ storeKey }}
                  >
                    Update Section
                  </Link>
                </Button>
              </div>
            ))}
        </CardContent>
      </Card>
    </section>
  );
};

const SectionProducts: React.FC<{ sectionId: number }> = ({ sectionId }) => {
  const { data: sectionProductsResponse } = useQuery({
    queryKey: ['getSectionsProducts', sectionId],
    queryFn: () => getHomesectionsProducts(sectionId),
    enabled: !!sectionId,
  });
  const sectionProducts = sectionProductsResponse?.Data;

  return (
    <div className="flex gap-[10px] flex-wrap">
      {sectionProducts &&
        sectionProducts.length &&
        sectionProducts.map((products) => (
          <div className="w-fit">
            <ProductCard ProductId={products.ProductId} />
          </div>
        ))}
    </div>
  );
};

export default StoreHome;
