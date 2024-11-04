import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  Button,
  Input,
  useToast,
  Card,
  CardContent,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  CardHeader,
  CardTitle,
  FormDescription,
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
import { Plus } from 'lucide-react';

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

  const [turnstileLoaded, resetTurnstile] = useTurnStileHook();

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
      resetTurnstile();
    },
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Category Update',
        description: response.response.data.Message,
        variant: 'destructive',
      });
    },
  });

  const handleFormWrapper = (e: any) => {
    e.preventDefault();
    try {
      const tRes = e.target['cf-turnstile-response'].value;

      if (!tRes) return;

      form.handleSubmit((values: z.infer<typeof formSchema>) =>
        onSubmit(values, tRes)
      )(e);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Please complete the Turnstile verification',
        variant: 'destructive',
      });
    }
  };

  return (
    <section>
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

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
          <p className="text-sm text-muted-foreground">
            Create a new category to organize your products
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleFormWrapper} className="space-y-6">
              <FormField
                control={form.control}
                name="CategoryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter category name"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription>
                      Choose a clear and descriptive name for your category
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <Turnstile
                  options={{ size: 'auto' }}
                  siteKey="0x4AAAAAAAQW6BNxMGjPxRxa"
                />
              </div>

              <Button
                type="submit"
                disabled={!turnstileLoaded}
                className="w-full sm:w-auto"
              >
                {!turnstileLoaded && (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                  </>
                )}
                {turnstileLoaded && (
                  <span className="flex items-center gap-2">
                    {isPending ? (
                      <>
                        <ReloadIcon className="h-4 w-4 animate-spin" />
                        Adding Category...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Add Category
                      </>
                    )}
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="my-5 flex gap-[10px] flex-wrap">
        {categories &&
          categories?.length > 0 &&
          categories?.map((category) => (
            <CategoriesCard key={category.Id} category={category} />
          ))}
      </div>
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
    <div className="bg-white shadow-md border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Parent Category</h3>
        <Button
          onClick={() => {
            setModalPath({
              modal: 'subcategory',
              parentCategoryId: category.Id,
            });
          }}
          variant="outline"
          size="sm"
        >
          Add Sub Category
        </Button>
      </div>

      <UpdateCategory category={category} />

      {subCategories && subCategories.length > 0 && (
        <>
          <div className="my-4 border-t border-gray-200" />
          <h4 className="text-md font-medium text-gray-700 mb-3">
            Sub Categories
          </h4>
          <div className="space-y-3">
            {subCategories?.map((s) => (
              <UpdateCategory key={s.Id} category={s} />
            ))}
          </div>
        </>
      )}
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
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Category Update',
        description: response.response.data.Message,
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
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Category Removed',
        description: response.response.data.Message,
        variant: 'destructive',
      });
    },
  });

  return (
    <div className="bg-gray-50 rounded-lg p-4 w-full">
      <div className="text-sm text-gray-500 mb-2">
        Category ID: {category.Id}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="CategoryName"
            render={({ field }) => (
              <FormItem className="mb-0">
                <FormControl>
                  <Input
                    placeholder="Category name"
                    className="bg-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button
              type="submit"
              variant="outline"
              className="flex-1"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update'
              )}
            </Button>

            <Button
              variant="destructive"
              className="flex-1"
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
