import React, { useState } from 'react';
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
  useToast,
  Card,
  CardContent,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@customer/components/index';
import { Link, useParams } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Category,
  addCategory,
  getCategories,
  getSubCategories,
  removeCategory,
  updateCategory,
} from './api';
import useTurnStileHook from '@customer/hooks/turnstile';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Turnstile } from '@marsidev/react-turnstile';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useModalStore } from '@customer/store/modalStore';

const formSchema = z.object({
  CategoryName: z.string().min(2).max(50),
});

const Categories = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      CategoryName: '',
    },
  });

  function onSubmit(
    values: z.infer<typeof formSchema>,
    turnstileResponse: string | null
  ) {
    handleAddCategory({
      ...values,
      'cf-turnstile-response': turnstileResponse,
    });
  }

  const { toast } = useToast();

  const { data: categoryResponse, refetch } = useQuery({
    queryKey: ['getCategories'],
    queryFn: () => getCategories(),
  });

  const categories = categoryResponse?.Data;

  const { mutate: handleAddCategory, isPending } = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      refetch();
      toast({
        title: 'Category create',
        description: 'category create successfull',
        variant: 'default',
      });

      form.reset();
      forceUpdate();
    },
    onError: () => {
      toast({
        title: 'Category create',
        description: 'category create failed',
        variant: 'destructive',
      });
    },
  });

  const forceUpdate = () => {
    window.location.reload();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormWrapper = (e: any) => {
    e.preventDefault();
    try {
      const tRes = e.target['cf-turnstile-response'].value;

      if (!tRes) return;

      form.handleSubmit((values: z.infer<typeof formSchema>) =>
        onSubmit(values, tRes)
      )(e);
    } catch (error) {
      forceUpdate();
    }
  };

  const [turnstileLoaded] = useTurnStileHook();

  return (
    <section className="w-full min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
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
            <Link
              to="/store/$storeKey/categories"
              params={{ storeKey: storeKey }}
            >
              Categories
            </Link>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardContent>
          <div className="my-2 mt-4">
            <Form {...form}>
              <form onSubmit={handleFormWrapper} className="space-y-8">
                <FormField
                  control={form.control}
                  name="CategoryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Add Category</FormLabel>
                      <FormControl>
                        <Input placeholder="category" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Turnstile
                  options={{ size: 'auto' }}
                  siteKey="0x4AAAAAAAQW6BNxMGjPxRxa"
                />

                <Button type="submit" disabled={!turnstileLoaded}>
                  {!turnstileLoaded && (
                    <>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      wait a few moment..
                    </>
                  )}
                  {turnstileLoaded && (
                    <span>{isPending ? 'Addding..' : 'Add Category'}</span>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>

      <div className="my-5 flex gap-[10px] flex-wrap">
        {categories &&
          categories?.length > 0 &&
          categories?.map((category) => (
            <CategoriesCard key={category.Id} category={category} />
          ))}
      </div>

      {/* prodcuts for categories */}
      {categories && categories.length > 0 && (
        <Tabs
          defaultValue={categories && categories[0].Id.toString()}
          className="w-[400px]"
        >
          <TabsList>
            {categories?.map((category) => (
              <TabsTrigger value={category.Id.toString()}>
                {category.Name}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories?.map((category) => (
            <TabsContent value={category.Id.toString()}>
              Make changes to your account here. {category.Name}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </section>
  );
};

const formSchemaUpdate = z.object({
  CategoryName: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

const CategoriesCard: React.FC<{ category: Category }> = ({ category }) => {
  const { setModalPath } = useModalStore((state) => state);
  const { data: subCategoriesResponse } = useQuery({
    queryKey: ['getSubCategories', category.Id],
    queryFn: () => getSubCategories(category.Id),
    enabled: !!category.Id,
  });

  const subCategories = subCategoriesResponse?.Data;
  return (
    <div className="shadow-lg border-2 border-slate-500 rounded-md p-2">
      <p>Parent Category</p>
      <UpdateCategory category={category} />
      <Button
        onClick={() => {
          setModalPath({ modal: 'subcategory', parentCategoryId: category.Id });
        }}
        className="my-2 mt-4 w-full"
      >
        Add Sub Category
      </Button>
      <p>Sub Categories</p>
      {subCategories?.map((s) => (
        <UpdateCategory category={s} />
      ))}
    </div>
  );
};

const UpdateCategory: React.FC<{ category: Category }> = ({ category }) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      CategoryName: category.Name,
    },
  });

  function onSubmit(values: z.infer<typeof formSchemaUpdate>) {
    handleUpdateCategory({
      id: category.Id,
      data: { ...values },
    });
  }

  const queryClient = useQueryClient();

  const { mutate: handleUpdateCategory, isPending } = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['getCategories'] });
      toast({
        title: 'Category update',
        description: 'category update successfull',
        variant: 'default',
      });
    },
    onError: () => {
      toast({
        title: 'Category update',
        description: 'category update failed',
        variant: 'destructive',
      });
    },
  });

  const { mutate: handleRemove } = useMutation({
    mutationFn: removeCategory,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['getCategories'] });
      toast({
        title: 'Category removed',
        description: 'category removed successfull',
        variant: 'default',
      });
    },
    onError: () => {
      toast({
        title: 'Category removed',
        description: 'category removed failed',
        variant: 'destructive',
      });
    },
  });

  return (
    <div className="border border-gray-300 rounded-md p-3 w-fit">
      <h1 className="mt-3">Category Id: {category.Id}</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="CategoryName"
            render={({ field }) => (
              <FormItem className="mb-0">
                <FormControl>
                  <Input placeholder="Category" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between gap-[3px]">
            <Button type="submit" variant={'outline'} className="w-full">
              <span>{isPending ? 'Updating..' : 'Update'}</span>
            </Button>

            <Button
              className="w-full"
              variant={'gradiantT'}
              onClick={(e) => {
                e.preventDefault();
                handleRemove({ id: category.Id });
              }}
            >
              Remove
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Categories;
