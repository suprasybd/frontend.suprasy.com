/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  RichTextEditor,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from '@/components/index';
import { Trash2 } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Link,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router';
import React, { useEffect, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Route as ProductsCreateRoute } from '../../../routes/store/$storeKey/products_/create';
import {
  createStoresProduct,
  getProductsDetails,
  getVariations,
  updateStoresProduct,
} from '../api';
import { productSchema } from './zod/productSchema';
import useTurnStileHook from '@/hooks/turnstile';
import { Turnstile } from '@marsidev/react-turnstile';
import { Plus } from 'lucide-react';
import { VariationCard } from './components/VariationCard';
import { slugify } from '@/lib/utils';

const CreateProduct: React.FC = () => {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    mode: 'all',
    defaultValues: {
      Description: '',
      Slug: '',
      Title: '',
      Type: '',
      Status: 'draft',
      ProductVariations: [
        {
          Inventory: 0,
          Price: 0,
          ChoiceName: 'default',
          Sku: '',
          Images: [],
          SalesPrice: 0,
          Deleted: false,
        },
      ],
    },
  });

  const { errors: formErrors } = form.formState;

  console.log('form errors', formErrors);

  const { toast } = useToast();
  const { storeKey } = useParams({ strict: false }) as {
    storeKey: string;
  };

  const { update, productId, uuid } = useSearch({
    from: ProductsCreateRoute.fullPath,
  });

  const isUpdating = !!productId && update;

  // @Api - @Data Fetching

  const { data: productDetailsResponse } = useQuery({
    queryKey: ['getProductDetails', productId, uuid],
    queryFn: () => getProductsDetails(productId || 0),

    enabled: !!productId && update,
  });

  const { data: variationsDataResponse } = useQuery({
    queryKey: ['getVarination', productId, storeKey],
    queryFn: () => getVariations(productId || 0),
    enabled: !!productId && update,
  });

  useEffect(() => {
    if (
      variationsDataResponse?.Data &&
      Array.isArray(variationsDataResponse.Data)
    ) {
      const validVariations = variationsDataResponse.Data.map((variation) => ({
        Id: variation.Id,
        ChoiceName: variation.ChoiceName || 'Default',
        Price: variation.Price || 0,
        SalesPrice: variation.SalesPrice || 0,
        Sku: variation.Sku || '',
        Inventory: variation.Inventory || 0,
        Images: variation.Images || [],
        Deleted: false,
      }));

      setTimeout(() => {
        form.setValue('ProductVariations', validVariations, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }, 0);

      console.log('Setting variations:', validVariations);
    }
  }, [variationsDataResponse?.Data, form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log('Form values updated:', value.ProductVariations);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const productDetails = productDetailsResponse?.Data;

  // Pre fill previous values for update

  console.log('values', form.getValues());

  useEffect(() => {
    if (productDetails) {
      form.setValue('Title', productDetails.Title);
      form.setValue('Description', productDetails.Description);
      form.setValue('Summary', productDetails.Summary);
      form.setValue('Slug', productDetails.Slug);

      form.setValue('Status', productDetails.Status);
    }
  }, [productDetails, form, isUpdating]);

  const navigate = useNavigate();

  const { mutate: updateProduct, isPending: updateProductLoading } =
    useMutation({
      mutationFn: updateStoresProduct,
      onSuccess: (response) => {
        toast({
          title: 'Product update',
          description: response.Message,
        });
        navigate({
          to: '/store/$storeKey/products',
          params: {
            storeKey,
          },
        });
      },
      onError: (response: {
        response: {
          data: {
            Message: string | string[];
          };
        };
      }) => {
        const errorMessage = Array.isArray(response.response.data.Message)
          ? response.response.data.Message.join('\n')
          : response.response.data.Message;

        toast({
          title: 'Product Update',
          description: errorMessage,
          variant: 'destructive',
        });
        window.turnstile?.reset();
      },
    });

  const { mutate: createProduct, isPending } = useMutation({
    mutationFn: createStoresProduct,
    onSuccess: (response) => {
      toast({
        title: 'Product Create',
        description: response.Message,
      });
      navigate({
        to: '/store/$storeKey/products',
        params: {
          storeKey,
        },
      });
    },
    onError: (response: {
      response: {
        data: {
          Message: string | string[];
        };
      };
    }) => {
      const errorMessage = Array.isArray(response.response.data.Message)
        ? response.response.data.Message.join('\n')
        : response.response.data.Message;

      toast({
        title: 'Product Create',
        description: errorMessage,
        variant: 'destructive',
      });
      window.turnstile?.reset();
    },
  });

  function onSubmit(
    values: z.infer<typeof productSchema>,
    turnstileResponse: string | null
  ) {
    const imageFormatedVariations = values.ProductVariations.map((v) => {
      if (v.Images && v.Images.length > 0) {
        return {
          ...v,
          Images: v.Images.map((i) => i.ImageUrl),
        };
      }
      return v;
    });

    const finalProduct = {
      ...values,
      ProductVariations: imageFormatedVariations,
    };

    if (!isUpdating) {
      createProduct({
        ...finalProduct,
        'cf-turnstile-response': turnstileResponse,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    } else {
      updateProduct({
        data: {
          ...finalProduct,
          'cf-turnstile-response': turnstileResponse,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        productId: productId,
      });
    }
  }

  const { errors } = form.formState;

  const {
    fields: variationsFields,
    append: appendVariation,
    remove: removeVariation,
  } = useFieldArray({
    control: form.control,
    name: 'ProductVariations',
  });

  const { move: moveImage } = useFieldArray({
    control: form.control,
    name: 'ProductVariations',
  });

  const productDescription = useMemo(() => {
    return productDetails?.Description;
  }, [productDetails]);

  const productSummary = useMemo(() => {
    return productDetails?.Summary;
  }, [productDetails]);

  const forceUpdate = () => {
    window.location.reload();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormWrapper = (e: any) => {
    e.preventDefault();
    try {
      const tRes = e.target['cf-turnstile-response'].value;

      if (!tRes) {
        window.turnstile?.reset();
        return;
      }

      form.handleSubmit((values: z.infer<typeof productSchema>) =>
        onSubmit(values, tRes)
      )(e);
    } catch (error) {
      window.turnstile?.reset();
    }
  };

  const status = form.watch('Status');

  const [turnstileLoaded] = useTurnStileHook();

  const generateSlug = () => {
    const title = form.getValues('Title');
    if (title) {
      const slug = slugify(title);
      form.setValue('Slug', slug);
    }
  };

  const generateSku = (index: number) => {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const sku = `SKU-${randomStr}`;
    form.setValue(`ProductVariations.${index}.Sku`, sku);
  };

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
              to="/store/$storeKey/products"
              params={{ storeKey: storeKey }}
            >
              Products
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create Product</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Form {...form}>
        <form onSubmit={handleFormWrapper} className="space-y-8">
          {/* Main content grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Info Section */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isUpdating ? 'Update Product' : 'Create Product'}
                  </CardTitle>
                  <CardDescription>
                    Enter Product Info Carefully!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="Title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            FormError={!!formErrors.Title}
                            placeholder="Title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description Editor */}
                  <div className="space-y-2">
                    <FormLabel>Description</FormLabel>
                    <FormField
                      control={form.control}
                      name="Description"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RichTextEditor
                              initialVal={productDescription}
                              onValChange={(data) => {
                                const jsonString = JSON.stringify(data);
                                form.setValue('Description', jsonString, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                              }}
                            />
                          </FormControl>
                          <FormMessage>
                            {errors.Description?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Summary Editor */}
                  <div className="space-y-2">
                    <FormLabel>Summary</FormLabel>
                    <FormField
                      control={form.control}
                      name="Summary"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RichTextEditor
                              initialVal={productSummary}
                              onValChange={(data) => {
                                const jsonString = JSON.stringify(data);
                                form.setValue('Summary', jsonString, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                              }}
                            />
                          </FormControl>
                          <FormMessage>{errors.Summary?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Product Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status Select */}
                  <div className="space-y-2" key={status}>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      onValueChange={(value) => form.setValue('Status', value)}
                      defaultValue={status || 'draft'}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Slug with Generate Button */}
                  <FormField
                    control={form.control}
                    name="Slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              FormError={!!formErrors.Slug}
                              placeholder="product-url-slug"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={generateSlug}
                          >
                            Generate
                          </Button>
                        </div>
                        <FormDescription>
                          e.g. mydomain.com/blue-t-shirt-special
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Product Variations */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Variations</CardTitle>
                  <CardDescription>
                    Manage product options like size, color etc.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {variationsFields.map((option, index) => (
                      <VariationCard
                        key={option.id}
                        option={option}
                        index={index}
                        form={form}
                        formErrors={formErrors}
                        onDelete={() => {
                          removeVariation(index);
                        }}
                        onGenerateSku={() => generateSku(index)}
                      />
                    ))}

                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        appendVariation({
                          ChoiceName: 'default',
                          Price: 0,
                          SalesPrice: 0,
                          Sku: '',
                          Images: [],
                          Inventory: 0,
                          Deleted: false,
                        });
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Variation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => navigate({ to: '..' })}
              type="button"
            >
              Cancel
            </Button>

            <Button
              disabled={updateProductLoading || isPending || !turnstileLoaded}
              type="submit"
              variant="defaultGradiant"
            >
              {!turnstileLoaded ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : isPending || updateProductLoading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : isUpdating ? (
                'Update Product'
              ) : (
                'Create Product'
              )}
            </Button>
          </div>

          <Turnstile
            options={{ size: 'auto' }}
            siteKey="0x4AAAAAAAQW6BNxMGjPxRxa"
          />
        </form>
      </Form>
    </section>
  );
};

export default CreateProduct;
