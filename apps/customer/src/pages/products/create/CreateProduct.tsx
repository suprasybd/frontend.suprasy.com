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
  Switch,
  useToast,
} from '@customer/components/index';
import { ArrowLeft, ArrowRight, Star, Trash2, Upload } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Link,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router';
import React, { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Route as ProductsCreateRoute } from '../../../routes/store/$storeKey/products_/create';
import {
  createStoresProduct,
  getProductAttributes,
  getProductSku,
  getProductsDetails,
  getProductsImages,
  getProductsVariantsDetails,
  updateStoresProduct,
} from '../api';
import { productSchema } from './zod/productSchema';
import { useModalStore } from '@customer/store/modalStore';
import { useMediaFormStore } from '@customer/store/mediaFormStore';
import useTurnStileHook from '@customer/hooks/turnstile';
import { Turnstile } from '@marsidev/react-turnstile';
import VariationImage from './components/VariationImage';

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
          Sku: 'SF-34526KP',
        },
      ],
    },
  });

  const { errors: formErrors } = form.formState;

  const { toast } = useToast();
  const { storeKey } = useParams({ strict: false }) as {
    storeKey: string;
  };

  const { update, productId, uuid, updateInventory } = useSearch({
    from: ProductsCreateRoute.fullPath,
  });

  const isUpdating = !!productId && update;

  // @Api - @Data Fetching

  const { data: productDetailsResponse } = useQuery({
    queryKey: ['getProductDetails', productId, uuid],
    queryFn: () => getProductsDetails(productId || 0),

    enabled: !!productId && update,
  });

  const { data: productVariantsResponse } = useQuery({
    queryKey: ['getProductVariantsDetails', productId],
    queryFn: () => getProductsVariantsDetails(productId || 0),
    enabled: !!productId && update,
  });

  const { data: productAttributeResponse } = useQuery({
    queryKey: ['getProductsAttribute', productId],
    queryFn: () => getProductAttributes(productId || 0),
    enabled: !!productId && update,
  });

  const { data: productSkuResponse } = useQuery({
    queryKey: ['getProductsAttribute', productId, productDetailsResponse],
    queryFn: () => getProductSku(productId || 0),
    enabled:
      !!productId &&
      update &&
      !productDetailsResponse?.Data.HasVariant &&
      !!productDetailsResponse?.Data,
  });

  const { data: productImagesResponse } = useQuery({
    queryKey: ['getProductImages', productId],
    queryFn: () => getProductsImages(productId || 0),
    enabled: !!productId && update,
  });

  const productDetails = productDetailsResponse?.Data;
  const productImagesData = productImagesResponse?.Data;
  const productAttributes = productAttributeResponse?.Data;
  const productSku = productSkuResponse?.Data;

  // Pre fill previous values for update

  useEffect(() => {
    if (productDetails) {
      form.setValue('Title', productDetails.Title);
      form.setValue('Description', productDetails.Description);
      form.setValue('Summary', productDetails.Summary);
      form.setValue('Slug', productDetails.Slug);

      form.setValue('Status', productDetails.Status);
    }

    if (productImagesData) {
      const productImagesFormatted = productImagesData.map((image) => ({
        ImageUrl: image.ImageUrl,
      }));
      console.log(productImagesFormatted);
      // form.setValue('Images', productImagesFormatted);

      // setImageUpdated((prev) => prev + 1);
    }
  }, [
    productDetails,
    form,
    productImagesData,
    isUpdating,
    productAttributes,
    productSku,
  ]);

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
      onError: (response: { response: { data: { Message: string } } }) => {
        toast({
          title: 'Product Update',
          description: response.response.data.Message,
          variant: 'destructive',
        });
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
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Product Create',
        description: response.response.data.Message,
        variant: 'destructive',
      });
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
    remove,
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

      if (!tRes) return;

      form.handleSubmit((values: z.infer<typeof productSchema>) =>
        onSubmit(values, tRes)
      )(e);
    } catch (error) {
      forceUpdate();
    }
  };

  const [turnstileLoaded] = useTurnStileHook();

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
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            {/* left */}
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card className={updateInventory ? 'hidden' : ''}>
                <CardHeader>
                  <CardTitle>
                    {isUpdating ? 'Update Product' : 'Create Product'}
                  </CardTitle>
                  <CardDescription>
                    Enter Product Info Carefully!
                  </CardDescription>
                </CardHeader>
                <CardContent>
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

                  <div className="mt-2">
                    <FormLabel>Description</FormLabel>
                    <p className="text-sm text-red-600">
                      {errors.Description?.message}
                    </p>
                    {productDescription && isUpdating && (
                      <RichTextEditor
                        initialVal={productDescription}
                        onValChange={(data) =>
                          form.setValue('Description', JSON.stringify(data))
                        }
                      />
                    )}

                    {!isUpdating && (
                      <RichTextEditor
                        onValChange={(data) =>
                          form.setValue('Description', JSON.stringify(data))
                        }
                      />
                    )}
                  </div>

                  {/* summary */}
                  <div className="mt-2">
                    <FormLabel>Summary</FormLabel>
                    <p className="text-sm text-red-600">
                      {errors.Summary?.message}
                    </p>

                    {productSummary && isUpdating && (
                      <RichTextEditor
                        initialVal={productSummary}
                        onValChange={(data) =>
                          form.setValue('Summary', JSON.stringify(data))
                        }
                      />
                    )}

                    {!isUpdating && (
                      <RichTextEditor
                        onValChange={(data) =>
                          form.setValue('Summary', JSON.stringify(data))
                        }
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {updateInventory && (
                <h1 className="text-xl font-bold my-3">
                  Update Variants & Inventory (Stock)
                </h1>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Options & Variants</CardTitle>
                  <CardDescription>
                    Does this product has options like size, color etc.?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {variationsFields.map((option, index) => {
                    return (
                      <div
                        key={option.id}
                        className=" border my-2 border-gray-600 p-3 rounded-md"
                      >
                        <VariationImage fieldIndex={index} form={form} />
                        <div className="flex flex-wrap gap-[3px]">
                          <FormField
                            control={form.control}
                            name={`ProductVariations.${index}.ChoiceName`}
                            render={({ field }) => (
                              <FormItem className=" rounded-lg pt-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Variation Name</FormLabel>
                                  <FormDescription></FormDescription>
                                </div>
                                <div className="flex gap-[7px] items-center">
                                  <FormControl>
                                    <Input
                                      FormError={
                                        !!formErrors?.ProductVariations?.[index]
                                          ?.ChoiceName
                                      }
                                      placeholder="Variation Name"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`ProductVariations.${index}.Sku`}
                            render={({ field }) => (
                              <FormItem className=" rounded-lg pt-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Sku</FormLabel>
                                  <FormDescription></FormDescription>
                                </div>
                                <div className="flex gap-[7px] items-center">
                                  <FormControl>
                                    <Input
                                      FormError={
                                        !!formErrors?.ProductVariations?.[index]
                                          ?.Sku
                                      }
                                      placeholder="Sku"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`ProductVariations.${index}.Inventory`}
                            render={({ field }) => (
                              <FormItem className=" rounded-lg pt-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Inventory</FormLabel>
                                  <FormDescription></FormDescription>
                                </div>
                                <div className="flex gap-[7px] items-center">
                                  <FormControl>
                                    <Input
                                      FormError={
                                        !!formErrors?.ProductVariations?.[index]
                                          ?.Inventory
                                      }
                                      placeholder="Inventory"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`ProductVariations.${index}.Price`}
                            render={({ field }) => (
                              <FormItem className=" rounded-lg pt-3 ">
                                <div className="space-y-0.5">
                                  <FormLabel>Price BDT</FormLabel>
                                  <FormDescription></FormDescription>
                                </div>
                                <div className="flex gap-[7px] items-center">
                                  <FormControl>
                                    <Input
                                      FormError={
                                        !!formErrors?.ProductVariations?.[index]
                                          ?.Price
                                      }
                                      placeholder="Price BDT"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`ProductVariations.${index}.SalesPrice`}
                            render={({ field }) => (
                              <FormItem className="space-y-0 !mt-3">
                                <FormLabel>Sales Price (BDT/৳) </FormLabel>
                                <FormControl>
                                  <Input
                                    FormError={
                                      !!formErrors?.ProductVariations?.[index]
                                        ?.SalesPrice
                                    }
                                    placeholder="Sales Price"
                                    {...field}
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Trash2
                            onClick={() => remove(index)}
                            className="hover:cursor-pointer"
                          />
                        </div>
                      </div>
                    );
                  })}

                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      appendVariation({
                        ChoiceName: 'default',
                        Price: 0,
                        SalesPrice: 0,
                        Images: [],
                        Inventory: 0,
                      });
                    }}
                  >
                    Add Variation
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* right */}
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent key={`${productDetails?.Status}`}>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        onValueChange={(value) => {
                          form.setValue('Status', value);
                        }}
                        defaultValue={productDetails?.Status || 'draft'}
                      >
                        <SelectTrigger id="status" aria-label="Select status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className={updateInventory ? 'hidden' : ''}>
                <CardHeader className="pb-0">
                  <CardTitle>Enter Product Slug / Url</CardTitle>
                  <CardDescription>
                    e.g. mydomain.com/blue-t-shirt-special
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="Slug"
                    render={({ field }) => (
                      <FormItem className="space-y-0 !mt-3">
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input
                            FormError={!!formErrors.Slug}
                            placeholder="Slug"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Turnstile
                options={{ size: 'auto' }}
                siteKey="0x4AAAAAAAQW6BNxMGjPxRxa"
              />

              <Button
                disabled={updateProductLoading || isPending || !turnstileLoaded}
                type="submit"
                className="w-full "
                variant={'defaultGradiant'}
              >
                {!turnstileLoaded && (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    wait a few moment..
                  </>
                )}

                {turnstileLoaded && (
                  <>
                    {(isPending || updateProductLoading) && (
                      <>
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    )}
                    {!isPending && isUpdating
                      ? 'Update Product'
                      : 'Create Product'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default CreateProduct;
