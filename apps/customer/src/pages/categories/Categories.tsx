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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  useToast,
  Card,
  CardHeader,
  CardContent,
} from '@customer/components/index';
import { Link, useParams, useStableCallback } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Category,
  addCategory,
  getCategories,
  removeCategory,
  updateCategory,
} from './api';
import { FilePenLine } from 'lucide-react';

const Categories = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };

  const [category, setCategory] = useState<string>('');

  const { toast } = useToast();

  const { data: categoryResponse, refetch } = useQuery({
    queryKey: ['getCategories'],
    queryFn: () => getCategories(),
  });

  const categories = categoryResponse?.Data;

  const { mutate: handleAddCategory } = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      refetch();
      toast({
        title: 'Category create',
        description: 'category create successfull',
        variant: 'default',
      });
      setCategory('');
    },
    onError: () => {
      toast({
        title: 'Category create',
        description: 'category create failed',
        variant: 'destructive',
      });
    },
  });

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
            <h1>Add Category</h1>
            <Input
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              value={category}
              className="my-3"
              placeholder="category name"
            />
            <Button
              onClick={() => {
                if (category) {
                  handleAddCategory(category);
                }
              }}
            >
              Add Category
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="my-5 flex gap-[10px] flex-wrap">
        {categories &&
          categories?.length > 0 &&
          categories?.map((category) => (
            <UpdateCategory key={category.Id} category={category} />
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

const UpdateCategory: React.FC<{ category: Category }> = ({ category }) => {
  const { toast } = useToast();

  const [categoryState, setCategory] = useState<string>(category.Name);

  const queryClient = useQueryClient();

  const { mutate: handleUpdateCategory } = useMutation({
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
      <Input
        onChange={(e) => {
          setCategory(e.target.value);
        }}
        value={categoryState}
      />

      <h1 className="mt-3">Category Id: {category.Id}</h1>
      <div className="flex justify-between gap-[3px]">
        <Button
          variant={'outline'}
          className="my-2 mt-5 w-full"
          onClick={() => {
            handleUpdateCategory({
              id: category.Id,
              categoryName: categoryState,
            });
          }}
        >
          Update
        </Button>

        <Button
          className="my-2 mt-5 w-full"
          variant={'gradiantT'}
          onClick={() => {
            handleRemove({ id: category.Id });
          }}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default Categories;
