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
} from '@customer/components/index';
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
  getProductAttributes,
  getProductSku,
  getProductsDetails,
  getProductsImages,
  getVariations,
  updateStoresProduct,
} from '../api';
import { productSchema } from './zod/productSchema';
import useTurnStileHook from '@customer/hooks/turnstile';
import { Turnstile } from '@marsidev/react-turnstile';
import VariationImage from './components/VariationImage';
import { Plus } from 'lucide-react';
import { VariationCard } from './components/VariationCard';
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
          Deleted: false,
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

  const { data: variationsDataResponse } = useQuery({
    queryKey: ['getVarination', productId],
    queryFn: () => getVariations(productId || 0),
    enabled: !!productId && update,
  });

  useEffect(() => {
    if (variationsDataResponse) {
      form.setValue('ProductVariations', variationsDataResponse.Data as any);
    }
  }, [variationsDataResponse, form]);

  const productDetails = productDetailsResponse?.Data;
  const productImagesData = productImagesResponse?.Data;
  const productAttributes = productAttributeResponse?.Data;
  const productSku = productSkuResponse?.Data;

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
    update: updateVariation,
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
          {/* Basic Info Section */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isUpdating ? 'Update Product' : 'Create Product'}
              </CardTitle>
              <CardDescription>Enter Product Info Carefully!</CardDescription>
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
                <FormMessage>{errors.Description?.message}</FormMessage>
                <RichTextEditor
                  initialVal={productDescription}
                  onValChange={(data) =>
                    form.setValue('Description', JSON.stringify(data))
                  }
                />
              </div>

              {/* Summary Editor */}
              <div className="space-y-2">
                <FormLabel>Summary</FormLabel>
                <FormMessage>{errors.Summary?.message}</FormMessage>
                <RichTextEditor
                  initialVal={productSummary}
                  onValChange={(data) =>
                    form.setValue('Summary', JSON.stringify(data))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Settings */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    onValueChange={(value) => form.setValue('Status', value)}
                    defaultValue={productDetails?.Status || 'draft'}
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product URL</CardTitle>
                <CardDescription>
                  e.g. mydomain.com/blue-t-shirt-special
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="Slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          FormError={!!formErrors.Slug}
                          placeholder="product-url-slug"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

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
                {variationsFields
                  .filter((v) => !v.Deleted)
                  .map((option, index) => (
                    <VariationCard
                      key={option.id}
                      option={option}
                      index={index}
                      form={form}
                      formErrors={formErrors}
                      onDelete={() =>
                        updateVariation(index, {
                          ...option,
                          Deleted: true,
                        })
                      }
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
