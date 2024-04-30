import React from 'react';
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
  RichTextEditor,
  useToast,
  RichTextRender,
} from '@frontend.suprasy.com/ui';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@frontend.suprasy.com/ui';

import { Link, useParams } from '@tanstack/react-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createSectionPost,
  getHomeSections,
  getHomesectionsProducts,
} from './api';

export const formSchemaHomesection = z.object({
  Title: z.string().min(2).max(50),
  Description: z.string().min(2).max(300),
  Products: z.array(z.object({ ProductId: z.coerce.number().min(0) })),
});

const StoreHome = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };

  const form = useForm<z.infer<typeof formSchemaHomesection>>({
    resolver: zodResolver(formSchemaHomesection),
    defaultValues: {
      Products: [{ ProductId: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'Products',
  });

  const { toast } = useToast();

  const { mutate: handleCreateSection } = useMutation({
    mutationFn: createSectionPost,
    onSuccess: () => {
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

  const { data: homeSectionsResponse } = useQuery({
    queryKey: ['getHomeSections'],
    queryFn: () => getHomeSections(),
  });

  const homeSesctions = homeSectionsResponse?.Data;

  function onSubmit(values: z.infer<typeof formSchemaHomesection>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const formatedProducts = values.Products.map(
      (product) => product.ProductId
    );
    handleCreateSection({ ...values, Products: formatedProducts });
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

          <RichTextEditor
            onValChange={(data) =>
              form.setValue('Description', JSON.stringify(data))
            }
          />
          <p className="text-sm text-red-600">{errors.Description?.message}</p>

          <h1>Product List (Place The Product Id the input)</h1>

          <div className="flex w-full flex-wrap gap-[30px]">
            {products.map((product, index) => (
              <div className="w-fit  min-w-[100px] flex justify-center items-center gap-[3px]">
                <FormField
                  control={form.control}
                  name={`Products.${index}.ProductId`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="section title" {...field} />
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
            onClick={(e) => {
              e.preventDefault();
              append({ ProductId: 1 });
            }}
          >
            Add Product
          </Button>
          <br></br>
          <Button type="submit">Create Section</Button>
        </form>
      </Form>

      {/* home sections */}
      <h1 className="my-10">Sections List</h1>
      {homeSesctions &&
        homeSesctions.length > 0 &&
        homeSesctions.map((section) => (
          <div className="p-5 border my-2 border-gray-300 rounded-md">
            <h1 className="text-4xl font-medium">{section.Title}</h1>
            <RichTextRender initialVal={section.Description} />

            <SectionProducts sectionId={section.Id} />
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
