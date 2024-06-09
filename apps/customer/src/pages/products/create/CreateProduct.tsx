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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  cn,
  useFormField,
  useToast,
} from '@customer/components/index';
import {
  ArrowLeft,
  ArrowRight,
  Star,
  Trash,
  Trash2,
  Upload,
} from 'lucide-react';

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

import ApiClient from '../../../libs/ApiClient';
import { Route as ProductsCreateRoute } from '../../../routes/store/$storeKey/products_/create';
import {
  createStoresProduct,
  getProductAttributes,
  getProductSku,
  getProductsDetails,
  getProductsImages,
  getProductsMultipleVariants,
  getProductsVariantsDetails,
  getProudcctsOptions,
  updateStoresProduct,
} from '../api';
import { StorefrontVariants } from '../api/types';
import { useCreateCountStore } from './store';
import { productSchema } from './zod/productSchema';
import { useModalStore } from '@customer/store/modalStore';
import { useMediaFormStore } from '@customer/store/mediaFormStore';

const CreateProduct: React.FC = () => {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    mode: 'onChange',
    defaultValues: {
      Description: '',
      Price: 99,
      Slug: '',
      Title: '',
      Type: '',
      Inventory: 2,
      HasVariants: false,
      Status: 'draft',
      ShowCompareAtPrice: true,
      CompareAtPrice: 190,
      AttributeName: 'Size',
      AttributeValue: [
        {
          Inventory: 99,
          Price: 190,
          Sku: 'SF-34526KP',
          Value: 'xl',
          CompareAtPrice: 190,
          ShowCompareAtPrice: true,
        },
      ],
      Images: [
        {
          ImageUrl:
            'https://static.suprasy.com/2470df57-b2e3-46e3-a7d3-2ee62ecb976d20240216012436',
        },
        {
          ImageUrl:
            'https://static.suprasy.com/130c440e-a52c-4383-bb45-f8b22486488720240216012427',
        },
      ],
    },
  });
  const [imageUpdated, setImageUpdated] = useState<number>(0);

  console.log('errors', form.formState.errors);

  const { append: appendImage, remove: removeImage } = useFieldArray({
    control: form.control,
    name: 'Images',
  });

  // set form into form store
  const { imagesList, setImagesList } = useMediaFormStore((state) => state);

  useEffect(() => {
    if (imagesList && imagesList.length) {
      const formatedImagesList = imagesList.map((image) => ({
        ImageUrl: image,
      }));
      appendImage(formatedImagesList);
      setImagesList([]);
    }
    console.log('run');
    // eslint-disable-next-line
  }, [imagesList]);

  const { errors: formErrors } = form.formState;

  const { setModalPath } = useModalStore((state) => state);
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
  const hasVariants = form.watch('HasVariants');

  const productImages = form.watch('Images');

  // Pre fill previous values for update

  useEffect(() => {
    if (productDetails) {
      form.setValue('Title', productDetails.Title);
      form.setValue('Description', productDetails.Description);
      form.setValue('Summary', productDetails.Summary);
      form.setValue('Slug', productDetails.Slug);
      form.setValue('HasVariants', productDetails.HasVariant);
      form.setValue('Status', productDetails.Status);
    }

    if (productAttributes && productDetails?.HasVariant) {
      const mappedAttributesValues = productAttributes.Values.map((value) => ({
        Inventory: value.sku.Inventory,
        Price: value.sku.Price,
        Sku: value.sku.Sku,
        Value: value.attributeValue.Value,
        ShowCompareAtPrice: value.sku.ShowCompareAtPrice,
        CompareAtPrice: value.sku.CompareAtPrice,
      }));

      form.setValue('AttributeName', productAttributes.Name.Name);
      form.setValue('AttributeValue', mappedAttributesValues);
    }

    if (productSku) {
      form.setValue('Sku', productSku.Sku);
      form.setValue('Price', productSku.Price);
      form.setValue('ShowCompareAtPrice', productSku.ShowCompareAtPrice);
      form.setValue('CompareAtPrice', productSku.CompareAtPrice);
      form.setValue('Inventory', productSku.Inventory);
    }

    if (productImagesData) {
      const productImagesFormatted = productImagesData.map((image) => ({
        ImageUrl: image.ImageUrl,
      }));
      console.log(productImagesFormatted);
      form.setValue('Images', productImagesFormatted);

      setImageUpdated((prev) => prev + 1);
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
      onError: () => {
        toast({
          title: 'Product update',
          description: 'Product update Failed Due To Server Error.',
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
    onError: () => {
      toast({
        title: 'Product Create',
        description: 'Product Create Failed Due To Server Error.',
        variant: 'destructive',
      });
    },
  });

  function onSubmit(values: z.infer<typeof productSchema>) {
    console.log(values);
    const formatedImages = values.Images.map(
      (value: { ImageUrl: string }) => value.ImageUrl
    );
    const finalProduct = {
      ...values,
      Images: formatedImages,
      Attribute: hasVariants && {
        Name: values.AttributeName,
        Values: values.AttributeValue,
      },
    };

    if (!isUpdating) {
      createProduct(finalProduct as any);
    } else {
      updateProduct({ data: finalProduct as any, productId: productId });
    }
  }

  const { errors } = form.formState;

  const {
    fields: attributeValues,
    append: appendAttributeValue,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'AttributeValue',
  });

  const { move: moveImage } = useFieldArray({
    control: form.control,
    name: 'Images',
  });

  const productDescription = useMemo(() => {
    return productDetails?.Description;
  }, [productDetails]);

  const productSummary = useMemo(() => {
    return productDetails?.Summary;
  }, [productDetails]);

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    <p className="text-sm text-red-600">
                      {errors.Description?.message}
                    </p>

                    <FormLabel>Description</FormLabel>

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
                    <p className="text-sm text-red-600">
                      {errors.Description?.message}
                    </p>

                    <FormLabel>Summary</FormLabel>

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

              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <CardDescription>
                    Select images and order them bellow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-[10px]">
                    {productImages.map((image, index) => {
                      return (
                        <div className="rounded-sm relative  border-gray-300 border-2">
                          <div className="relative h-[160px] w-[200px] rounded-sm border broder-b-4 border-blue-400">
                            <img
                              src={image.ImageUrl}
                              alt="product"
                              className="object-cover w-full h-full "
                            />
                          </div>
                          {index === 0 && (
                            <div className="absolute top-[-10px] left-[-10px] bg-yellow-300 text-red-600 rounded-lg p-1">
                              {' '}
                              <Star />
                            </div>
                          )}
                          <div className="flex w-full ">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                if (index !== 0) {
                                  moveImage(index, index - 1);
                                } else {
                                  moveImage(index, productImages.length - 1);
                                }
                              }}
                              className="w-full flex justify-center hover:bg-slate-300 border border-r-1 border-t-0 border-l-0 border-b-0 border-gray-500  p-2 "
                            >
                              <ArrowLeft />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                if (index !== productImages.length - 1) {
                                  moveImage(index, index + 1);
                                } else {
                                  moveImage(index, 0);
                                }
                              }}
                              className="w-full flex justify-center hover:bg-slate-300 border border-r-1 border-t-0 border-l-0 border-b-0 border-gray-500  p-2 "
                            >
                              <ArrowRight />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                removeImage(index);
                              }}
                              className="w-full flex justify-center hover:bg-slate-300 p-2 "
                            >
                              <Trash2 />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={(e) => {
                      // set modal here
                      e.preventDefault();
                      setModalPath({ modal: 'media' });
                    }}
                    className="flex aspect-square mt-10 w-[200px] h-[160px] items-center justify-center rounded-md border border-dashed"
                  >
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Upload</span>
                  </button>
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
                  <div>
                    <div className="space-y-4">
                      {!hasVariants && (
                        <FormField
                          control={form.control}
                          name={'Sku'}
                          render={({ field }) => (
                            <FormItem className=" rounded-lg pt-3">
                              <div className="space-y-0.5">
                                <FormLabel>Product Sku</FormLabel>
                                <FormDescription></FormDescription>
                              </div>
                              <div className="flex gap-[7px] items-center">
                                <FormControl>
                                  <Input
                                    defaultValue={'SKU-234512'}
                                    placeholder="Sku"
                                    {...field}
                                  />
                                </FormControl>
                              </div>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="HasVariants"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Product has variants</FormLabel>
                              <FormDescription>
                                Check here if this product has options and
                                variants.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {hasVariants && (
                      <div className="mt-3">
                        <FormField
                          control={form.control}
                          name={`AttributeName`}
                          render={({ field }) => (
                            <FormItem className=" rounded-lg pt-3">
                              <div className="space-y-0.5">
                                <FormLabel>Attribute Name</FormLabel>
                                <FormDescription></FormDescription>
                              </div>
                              <div className="flex gap-[7px] items-center">
                                <FormControl>
                                  <Input
                                    placeholder="Attribute Name"
                                    {...field}
                                  />
                                </FormControl>
                              </div>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Card className="mt-3">
                          <CardHeader>
                            <CardTitle>Attribute Values List</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {attributeValues.map((option, index) => {
                              return (
                                <div
                                  key={option.id}
                                  className="flex flex-wrap gap-[3px] border my-2 border-gray-600 p-3 rounded-md"
                                >
                                  <FormField
                                    control={form.control}
                                    name={`AttributeValue.${index}.Value`}
                                    render={({ field }) => (
                                      <FormItem className=" rounded-lg pt-3">
                                        <div className="space-y-0.5">
                                          <FormLabel>Value</FormLabel>
                                          <FormDescription></FormDescription>
                                        </div>
                                        <div className="flex gap-[7px] items-center">
                                          <FormControl>
                                            <Input
                                              FormError={
                                                !!formErrors?.AttributeValue?.[
                                                  index
                                                ]?.Value
                                              }
                                              placeholder="Value"
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
                                    name={`AttributeValue.${index}.Sku`}
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
                                                !!formErrors?.AttributeValue?.[
                                                  index
                                                ]?.Sku
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
                                    name={`AttributeValue.${index}.Inventory`}
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
                                                !!formErrors?.AttributeValue?.[
                                                  index
                                                ]?.Inventory
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
                                    name={`AttributeValue.${index}.CompareAtPrice`}
                                    render={({ field }) => (
                                      <FormItem className="space-y-0 !mt-3">
                                        <FormLabel>
                                          Compare At Price (BDT/৳){' '}
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            FormError={
                                              !!formErrors?.AttributeValue?.[
                                                index
                                              ]?.CompareAtPrice
                                            }
                                            placeholder="Compare At Price"
                                            {...field}
                                          />
                                        </FormControl>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name={`AttributeValue.${index}.ShowCompareAtPrice`}
                                    render={({ field }) => (
                                      <FormItem className=" mt-3 mx-3 px-3 flex-row items-center justify-between rounded-lg border shadow-sm">
                                        <div className="space-y-0.5">
                                          <FormLabel>
                                            Show compare at price
                                          </FormLabel>
                                        </div>
                                        <FormControl>
                                          <Switch
                                            className="p-0"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`AttributeValue.${index}.Price`}
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
                                                !!formErrors?.AttributeValue?.[
                                                  index
                                                ]?.Price
                                              }
                                              placeholder="Price BDT"
                                              {...field}
                                            />
                                          </FormControl>

                                          <Trash2
                                            onClick={() => remove(index)}
                                            className="hover:cursor-pointer"
                                          />
                                        </div>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              );
                            })}

                            <Button
                              className="mt-3"
                              onClick={(e) => {
                                e.preventDefault();
                                appendAttributeValue({
                                  Inventory: 88,
                                  Price: 10,
                                  Sku: 'DEFAULT_SKU_35234',
                                  Value: 'xl',
                                  CompareAtPrice: 190,
                                  ShowCompareAtPrice: true,
                                });
                              }}
                            >
                              Add More Value
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {!hasVariants && (
                <Card id="inventory">
                  <CardHeader className="pb-0 ">
                    <CardTitle>Enter Single Product Price</CardTitle>
                    <CardDescription>e.g. 199 Price (BDT/৳)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="Price"
                      render={({ field }) => (
                        <FormItem className="space-y-0 !mt-3">
                          <FormLabel>Price (BDT/৳) </FormLabel>
                          <FormControl>
                            <Input
                              FormError={!!formErrors.Price}
                              placeholder="Price"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="CompareAtPrice"
                      render={({ field }) => (
                        <FormItem className="space-y-0 !mt-3">
                          <FormLabel>Compare At Price (BDT/৳) </FormLabel>
                          <FormControl>
                            <Input
                              FormError={!!formErrors.CompareAtPrice}
                              placeholder="Compare At Price"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ShowCompareAtPrice"
                      render={({ field }) => (
                        <FormItem className="flex mt-3 flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Show compare at price</FormLabel>
                            <FormDescription>
                              Check here if you want to show compare at price
                              with how much off
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="Inventory"
                      render={({ field }) => (
                        <FormItem className="space-y-0 !mt-3">
                          <FormLabel>Inventory / Quantity</FormLabel>
                          <FormControl>
                            <Input
                              FormError={!!formErrors.Inventory}
                              placeholder="Inventory/Qty"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              )}
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
              <Button
                disabled={updateProductLoading || isPending}
                type="submit"
                className="w-full "
                variant={'defaultGradiant'}
              >
                {(isPending || updateProductLoading) && (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                )}
                {!isPending && isUpdating ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default CreateProduct;
