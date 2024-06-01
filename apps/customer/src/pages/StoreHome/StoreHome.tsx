import React, { useEffect, useMemo, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  Button,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  RichTextEditor,
  useToast,
  RichTextRender,
} from '@customer/components/index';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@customer/components/index';

import { Link, useParams } from '@tanstack/react-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSectionPost,
  deleteSection,
  getHomeSections,
  getHomesectionsProducts,
  getSectionById,
  updateSectionPost,
} from './api';
import { useModalStore } from '@customer/store/modalStore';

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

  const { setModalPath } = useModalStore((state) => state);

  const queryClient = useQueryClient();

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

  const { mutate: handleCreateSection } = useMutation({
    mutationFn: createSectionPost,
    onSuccess: () => {
      refetch();

      toast({
        title: 'home section create',
        description: 'home section create successfull',
        variant: 'default',
      });
    },
    onError: () => {
      toast({
        title: 'home section create',
        description: 'home section create failed',
        variant: 'destructive',
      });
    },
  });

  const { mutate: handleUpdateSection } = useMutation({
    mutationFn: updateSectionPost,
    onSuccess: () => {
      refetch();
      queryClient.refetchQueries({ queryKey: ['getSectionsProducts'] });
      setIsUpdating(false);
      form.reset();
      toast({
        title: 'home section update',
        description: 'home section update successfull',
        variant: 'default',
      });
    },
    onError: () => {
      toast({
        title: 'home section update',
        description: 'home section update failed',
        variant: 'destructive',
      });
    },
  });

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

  const description = useMemo(() => {
    return section?.Description;
  }, [section]);

  const homeSesctions = homeSectionsResponse?.Data;

  function onSubmit(values: z.infer<typeof formSchemaHomesection>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const formatedProducts = values.Products.map(
      (product) => product.ProductId
    );

    if (!isUpdating) {
      handleCreateSection({ ...values, Products: formatedProducts });
    }
    if (isUpdating) {
      handleUpdateSection({
        sectionId,
        data: { ...values, Products: formatedProducts },
      });
    }
  }

  const products = form.getValues('Products');

  const { errors } = form.formState;

  return (
    <section className="w-full min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      {/* breadcrumbs */}
      <Breadcrumb className="pb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link
              to="/store/$storeKey/dashboard"
              params={{ storeKey: storeKey }}
            >
              Home
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link to="/store/$storeKey/home" params={{ storeKey: storeKey }}>
              Home Page
            </Link>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* create section */}

      <Card>
        <CardHeader>
          <CardTitle>Create Section</CardTitle>
          <CardDescription>Create Section Form</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="Title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="section title" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <h1>Section Summary</h1>

              {!isUpdating && (
                <RichTextEditor
                  onValChange={(data) =>
                    form.setValue('Description', JSON.stringify(data))
                  }
                />
              )}

              {description && isUpdating && (
                <RichTextEditor
                  initialVal={description}
                  onValChange={(data) =>
                    form.setValue('Description', JSON.stringify(data))
                  }
                />
              )}

              <p className="text-sm text-red-600">
                {errors.Description?.message}
              </p>

              <Card>
                <CardHeader>
                  <CardTitle>Products List</CardTitle>
                </CardHeader>
                <CardContent>
                  <h1>Product List (Place The Product Id the input)</h1>

                  <div className="flex w-full flex-wrap gap-[30px]">
                    {products?.length > 0 &&
                      products.map((product, index) => (
                        <div className="w-fit  min-w-[100px] flex justify-center items-center gap-[3px]">
                          <FormField
                            control={form.control}
                            name={`Products.${index}.ProductId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="section title"
                                    {...field}
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              remove(index);
                            }}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      ))}
                  </div>

                  <Button
                    className="my-3"
                    onClick={(e) => {
                      e.preventDefault();
                      // append({ ProductId: 1 });
                      setModalPath({ modal: 'product-selection' });
                      //  here
                    }}
                  >
                    Add Product
                  </Button>
                </CardContent>
              </Card>

              <br></br>
              <Button className="w-full" type="submit">
                {isUpdating ? 'Update Section' : '    Create Section'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* home sections */}
      <h1 className="my-10">Sections List</h1>
      {homeSesctions &&
        homeSesctions.length > 0 &&
        homeSesctions.map((section) => (
          <div className="p-5 border my-2 border-gray-300 rounded-md">
            <h1 className="text-4xl font-medium">{section.Title}</h1>
            <RichTextRender initialVal={section.Description} />

            <SectionProducts sectionId={section.Id} />

            <Button
              className="my-5"
              variant={'destructive'}
              onClick={() => {
                handleDeleteSection(section.Id);
              }}
            >
              Remove Section
            </Button>

            <Button
              className="my-5 mx-2"
              onClick={() => {
                form.setValue('Products', []);
                setSectionId(section.Id);
                setIsUpdating(true);
              }}
            >
              Update Section
            </Button>
          </div>
        ))}
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
    <div>
      {sectionProducts &&
        sectionProducts.length &&
        sectionProducts.map((products) => (
          <div>
            <h1>Product Id: {products.ProductId} </h1>
          </div>
        ))}
    </div>
  );
};

export default StoreHome;
