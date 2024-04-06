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
} from '@frontend.suprasy.com/ui';
import { Trash2, Upload } from 'lucide-react';

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

const CreateProduct: React.FC = () => {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      Description: '',
      Price: 99,
      Slug: '',
      Title: '',
      Type: '',
      Inventory: 2,
      HasVariants: false,
      AttributeName: 'Size',
      AttributeValue: [
        { Inventory: 99, Price: 190, Sku: 'SF-34526KP', Value: 'xl' },
      ],
      Images: [
        'https://static.suprasy.com/2470df57-b2e3-46e3-a7d3-2ee62ecb976d20240216012436',

        'https://static.suprasy.com/130c440e-a52c-4383-bb45-f8b22486488720240216012427',
      ],
    },
  });
  const [imageUpdated, setImageUpdated] = useState<number>(0);

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

  const { data: productImagesResponse } = useQuery({
    queryKey: ['getProductImages', productId],
    queryFn: () => getProductsImages(productId || 0),
    enabled: !!productId && update,
  });

  const { data: productOptionsResponse } = useQuery({
    queryKey: ['getProductOptions', productId, uuid],
    queryFn: () => getProudcctsOptions(productId || 0),
    enabled: !!productId && update,
  });

  const {
    data: productMultipleVariantsResponse,
    isSuccess: getMultipleVariantsSuccess,
  } = useQuery({
    queryKey: ['getProductsMultipleVariantsOptionsValue', productId, uuid],
    queryFn: () => getProductsMultipleVariants(productId || 0),
    enabled: !!productId && update,
  });

  const productDetails = productDetailsResponse?.Data;
  const productVariantDetails = productVariantsResponse?.Data;
  const productImagesData = productImagesResponse?.Data;
  const productOptions = productOptionsResponse?.Data;
  const productsMultipleVariants = productMultipleVariantsResponse?.Data;

  const hasVariants = form.watch('HasVariants');

  const productImages = form.watch('Images');

  // Pre fill previous values for update

  useEffect(() => {
    if (productDetails) {
      form.setValue('Title', productDetails.Title);
      form.setValue('Description', productDetails.Description);
      form.setValue('Slug', productDetails.Slug);
      form.setValue('HasVariants', productDetails.HasVariant);
    }

    if (productVariantDetails) {
      form.setValue('Price', productVariantDetails.Price);
      form.setValue('Inventory', productVariantDetails.Inventory);
    }

    if (productImagesData) {
      const productImagesFormatted = productImagesData.map((image) => ({
        ImageUrl: image.ImageUrl,
      }));

      setImageUpdated((prev) => prev + 1);
    }
  }, [
    productDetails,
    form,
    productVariantDetails,
    productImagesData,
    isUpdating,
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
    // const filteredActiveSku = values.Variants.filter((vari) => vari.IsActive);
    // const finalProduct = {
    //   ...values,
    //   Variants: hasVariants
    //     ? filteredActiveSku
    //     : [{ Price: values.Price, Inventory: values.Inventory }],
    //   Options: values.VariantsOptions,
    // };
    // if (!isUpdating) {
    //   createProduct(finalProduct as any);
    // } else {
    //   // hit update product endpoint
    //   updateProduct({ data: finalProduct as any, productId: productId });
    // }
  }

  const { errors } = form.formState;

  // const generateCombinations = (
  //   options: {
  //     Name: string;
  //     Values: string[];
  //   }[],
  //   currentIndex = 0,
  //   currentCombination = []
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // ): any => {
  //   if (currentIndex === options.length) {
  //     return [currentCombination];
  //   }

  //   const currentOption = options[currentIndex];
  //   const combinations = [];

  //   for (const value of currentOption.Values) {
  //     const nextCombination = [
  //       ...currentCombination,
  //       { OptionName: currentOption.Name, Value: value },
  //     ];
  //     combinations.push(
  //       ...generateCombinations(
  //         options,
  //         currentIndex + 1,
  //         nextCombination as never
  //       )
  //     );
  //   }

  //   return combinations;
  // };

  // const attributeValues = form.watch('AttributeValue');
  const {
    fields: attributeValues,
    append: appendAttributeValue,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'AttributeValue',
  });
  console.log('attribute values', attributeValues);
  const productDescription = useMemo(() => {
    return productDetails?.Description;
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
                          <Input placeholder="Title" {...field} />
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

                  {/* <FormField
                control={form.control}
                name="Description"
                render={({ field }) => (
                  <FormItem className="space-y-0 !mt-3">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={10}
                        placeholder="Enter product description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              /> */}
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
                          <Input placeholder="Slug" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <CardDescription>
                    Lipsum dolor sit amet, consectetur adipiscing elit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 gap-2">
                      <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
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
                  <div>
                    <div className="space-y-4">
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
                                <div key={option.id} className="flex gap-[3px]">
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
                                  Inventory: 0,
                                  Price: 10,
                                  Sku: 'DEFAULT_SKU_35234',
                                  Value: 'xl',
                                });
                              }}
                            >
                              Add More Value
                            </Button>
                          </CardContent>
                        </Card>

                        {/* {VariantsOptions.map((option, index) => {
                      return (
                        <Card className="mb-3" key={index}>
                          <CardContent>
                            <div>
                              <FormField
                                control={form.control}
                                name={`VariantsOptions.${index}.Name`}
                                render={({ field }) => (
                                  <FormItem className=" rounded-lg pt-3">
                                    <div className="space-y-0.5">
                                      <FormLabel>Option Name</FormLabel>
                                      <FormDescription></FormDescription>
                                    </div>
                                    <div className="flex gap-[7px] items-center">
                                      <FormControl>
                                        <Input
                                          onChangeCapture={() =>
                                            incrementChanges()
                                          }
                                          placeholder="Option Name"
                                          {...field}
                                        />
                                      </FormControl>
                                      <Trash2
                                        onClick={() => remove(removeindex
                                        className="hover:cursor-pointer"
                                      />
                                    </div>

                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Card className="mt-3">
                                <CardContent>
                                  <h3 className="mt-3">Values</h3>

                                  <div className="flex gap-1 items-center">
                                    {Variants[index]?.Values.map(
                                      (option, index) => (
                                        <span key={index}>
                                          {option && (
                                            <span className="block bg-gradient-to-r from-violet-600 to-indigo-600 px-2 w-fit rounded text-sm text-white">
                                              {option}
                                            </span>
                                          )}
                                        </span>
                                      )
                                    )}
                                  </div>

                                  <NestedValues
                                    nestIndex={index}
                                    control={form.control}
                                  />
                                </CardContent>
                              </Card>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })} */}
                        {/* <Button
                      onClick={(e) => {
                        e.preventDefault();
                        append({
                          Name: 'Default Name',
                          Values: ['Value 1', 'Value 2'],
                        });
                      }}
                    >
                      Add More Option
                    </Button> */}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {!hasVariants && (
                <Card id="inventory">
                  <CardHeader className="pb-0">
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
                            <Input placeholder="Price" {...field} />
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
                            <Input placeholder="Inventory/Qty" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              )}

              {/* {hasVariants && (
            <Card id="inventory">
              <CardHeader className="pb-0">
                <CardTitle>
                  Enter Inventory(Quantity) / Price For Variants
                </CardTitle>
                <CardDescription>
                  e.g. 1 Inventory, 199 Price (BDT/৳)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {variantSku.map((combinations, index) => (
                  <div
                    key={combinations.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 flex gap-[8px]">
                      <div className="whitespace-nowrap">
                        <FormField
                          control={form.control}
                          name={`Variants.${index}.IsActive`}
                          render={({ field }) => (
                            <FormItem className="space-y-0 flex items-center">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="whitespace-nowrap ml-[8px]">
                                {combinations.Options.map(
                                  (option) => option.Value
                                ).join('-')}
                              </FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex-1 w-full">
                      <FormField
                        control={form.control}
                        name={`Variants.${index}.Price`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel>Price (BDT/৳) </FormLabel>
                            <FormControl>
                              <Input placeholder="Price" {...field} />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <FormField
                        control={form.control}
                        name={`Variants.${index}.Inventory`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel>Inventory</FormLabel>
                            <FormControl>
                              <Input placeholder="Inventory" {...field} />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )} */}

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
                {!isPending && isUpdating ? 'Update' : 'Create'}
              </Button>
            </div>

            {/* right */}
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="status">Status</Label>
                      <Select>
                        <SelectTrigger id="status" aria-label="Select status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Active</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default CreateProduct;
