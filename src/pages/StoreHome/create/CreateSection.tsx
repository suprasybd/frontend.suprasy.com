import { useEffect, useMemo, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  Button,
  Input,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  RichTextEditor,
  useToast,
} from '@/components/index';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/index';

import {
  Link,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router';
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
} from '../api';
import { useModalStore } from '@/store/modalStore';
import { useProductSelectionStore } from '@/store/productSelection';
import { ProductCard } from '@/components/Modals/ProductSelection/ProductSelection';
import useTurnStileHook from '@/hooks/turnstile';
import { Turnstile } from '@marsidev/react-turnstile';
import { ReloadIcon } from '@radix-ui/react-icons';

import { Route as SectionCreateRoute } from '../../../routes/store/$storeKey/section_/create';

export const formSchemaHomesection = z.object({
  Title: z.string().min(2).max(50),
  Description: z.string().min(2).max(300),
  Products: z.array(z.object({ ProductId: z.coerce.number().min(0) })),
});

const CreateSection = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };

  const { update, sectionId, uuid } = useSearch({
    from: SectionCreateRoute.fullPath,
  });

  const isUpdating = !!sectionId && update;

  const form = useForm<z.infer<typeof formSchemaHomesection>>({
    resolver: zodResolver(formSchemaHomesection),
    defaultValues: {},
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'Products',
  });

  const { setModalPath } = useModalStore((state) => state);
  const { Product } = useProductSelectionStore((state) => state);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { toast } = useToast();

  const { data: sectionResponse } = useQuery({
    queryKey: ['getSectionById', sectionId],
    queryFn: () => getSectionById(sectionId as number),
    enabled: !!sectionId && isUpdating,
  });

  const { data: sectionProductsResponse } = useQuery({
    queryKey: ['getSectionProductsByIdForUpdate', sectionId],
    queryFn: () => getHomesectionsProducts(sectionId as number),
    enabled: !!sectionId && isUpdating,
  });

  const section = sectionResponse?.Data;
  const sectionProducts = sectionProductsResponse?.Data;

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

  const { mutate: handleCreateSection, isPending: loadingOne } = useMutation({
    mutationFn: createSectionPost,
    onSuccess: () => {
      toast({
        title: 'home section create',
        description: 'home section create successfull',
        variant: 'default',
      });
      navigate({ to: '/store/$storeKey/home', params: { storeKey } });
    },
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'home section create',
        description: response.response.data.Message,
        variant: 'destructive',
      });
    },
  });

  const { mutate: handleUpdateSection, isPending: loadingTwo } = useMutation({
    mutationFn: updateSectionPost,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['getSectionsProducts'] });

      form.reset();
      toast({
        title: 'home section update',
        description: 'home section update successfull',
        variant: 'default',
      });
      navigate({ to: '/store/$storeKey/home', params: { storeKey } });
    },
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'home section update',
        description: response.response.data.Message,
        variant: 'destructive',
      });
    },
  });

  const { mutate: handleDeleteSection } = useMutation({
    mutationFn: deleteSection,
    onSuccess: () => {
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

  const description = useMemo(() => {
    return section?.Description;
  }, [section]);

  useEffect(() => {
    if (Product) {
      append({ ProductId: Product });
    }
    // eslint-disable-next-line
  }, [Product]);

  function onSubmit(
    values: z.infer<typeof formSchemaHomesection>,
    turnstileResponse: string | null
  ) {
    const formatedProducts = values.Products.map(
      (product) => product.ProductId
    );

    if (!isUpdating) {
      handleCreateSection({
        ...values,
        Products: formatedProducts,
        'cf-turnstile-response': turnstileResponse,
      });
    }
    if (isUpdating) {
      handleUpdateSection({
        sectionId,
        data: {
          ...values,
          Products: formatedProducts,
          'cf-turnstile-response': turnstileResponse,
        },
      });
    }
  }

  const products = form.getValues('Products');

  const { errors } = form.formState;

  const forceUpdate = () => {
    window.location.reload();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormWrapper = (e: any) => {
    e.preventDefault();
    try {
      const tRes = e.target['cf-turnstile-response'].value;

      if (!tRes) return;

      form.handleSubmit((values: z.infer<typeof formSchemaHomesection>) =>
        onSubmit(values, tRes)
      )(e);
    } catch (error) {
      forceUpdate();
    }
  };
  const [turnstileLoaded] = useTurnStileHook();

  const isPending = loadingOne || loadingTwo;

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
            <Link
              to="/store/$storeKey/section/create"
              params={{ storeKey: storeKey }}
            >
              Create Section
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
            <form onSubmit={handleFormWrapper} className="space-y-8">
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
                  <h1>Product List (Place The Product Id the input)</h1>
                </CardHeader>
                <CardContent>
                  <div className="flex w-full flex-wrap gap-[30px]">
                    {products?.length > 0 &&
                      products.map((product, index) => (
                        <div className="w-fit border border-green-400 border-[5px] rounded-md bg-slate-800 text-black min-w-[100px] flex justify-center items-center gap-[3px]">
                          <ProductCard ProductId={product.ProductId} compact />
                          <Button
                            className="h-full"
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

              <Turnstile
                options={{ size: 'auto' }}
                siteKey="0x4AAAAAAAQW6BNxMGjPxRxa"
              />

              <Button
                className="w-full"
                type="submit"
                disabled={!turnstileLoaded}
              >
                {!turnstileLoaded && (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    wait a few moment..
                  </>
                )}

                {turnstileLoaded && (
                  <span>
                    {isUpdating && !isPending && 'Update Section'}
                    {!isUpdating && !isPending && 'Create Section'}
                    {isPending && 'Processing..'}
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default CreateSection;
