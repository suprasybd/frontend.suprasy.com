import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Switch,
  Textarea,
  RichTextEditor,
  useToast,
} from '@frontend.suprasy.com/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import cn from 'classnames';
import { Grip, Plus, Trash, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

import { ApiClientCF } from '../../../libs/ApiClient';
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
import NestedValues from './components/NestedValues';
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
      VariantsOptions: [{ Name: 'Size', Values: ['xl', 'lg', 'sm'] }],
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

  const formattedOptions = useMemo(() => {
    const optionsMap: { [key: string]: Set<string> } = {};

    productOptions?.forEach((option) => {
      const { Name } = option.storefront_options;
      const { Value } = option.storefront_options_value;

      if (optionsMap[Name]) {
        optionsMap[Name].add(Value);
      } else {
        optionsMap[Name] = new Set([Value]);
      }
    });

    const formattedOptionsArray = Object.entries(optionsMap).map(
      ([Name, Values]) => ({
        Name,
        Values: Array.from(Values),
      })
    );

    return formattedOptionsArray;
  }, [productOptions]);

  const formattedMultipleVariantsOptionsValue = useMemo(() => {
    if (productsMultipleVariants && productDetails?.HasVariant) {
      const uniqueVariants: Record<
        number | string,
        {
          variant: StorefrontVariants | null;
          options: Array<string>;
        }
      > = {};

      productsMultipleVariants
        .slice()
        .reverse()
        .forEach((variantDetails) => {
          if (!uniqueVariants[variantDetails.storefront_variants.Id]) {
            uniqueVariants[variantDetails.storefront_variants.Id] = {
              variant: null,
              options: [],
            };
          }

          if (!uniqueVariants[variantDetails.storefront_variants.Id].variant) {
            uniqueVariants[variantDetails.storefront_variants.Id].variant =
              variantDetails.storefront_variants;
          }

          uniqueVariants[variantDetails.storefront_variants.Id].options.push(
            variantDetails.storefront_options_value.Value
          );
        });

      const formattedData = Object.values(uniqueVariants).map((data) => ({
        Value: data.options.join('-'),
        Price: data.variant?.Price,
        Inventory: data.variant?.Inventory,
      }));

      return formattedData;
    }
  }, [productsMultipleVariants, productDetails]);

  const hasVariants = form.watch('HasVariants');
  const Variants = form.watch('VariantsOptions');
  const productImages = form.watch('Images');
  const VariantsOptions = form.watch('VariantsOptions');
  const MultipleVariants = form.watch('Variants');

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

      form.setValue('Images', productImagesFormatted);

      setImageUpdated((prev) => prev + 1);
    }

    if (formattedOptions && isUpdating && productDetails?.HasVariant) {
      form.setValue('VariantsOptions', formattedOptions);
    }
  }, [
    productDetails,
    form,
    productVariantDetails,
    productImagesData,
    isUpdating,
    formattedOptions,
  ]);

  const [multipleVariantsPulled, setMultipleVariantsPulled] =
    useState<number>(0);

  // pull previous variants combinations and fill form

  useEffect(() => {
    const totalCombinations = VariantsOptions.map(
      (data) => data.Values.length
    ).reduce((sum, current) => sum * current, 1);

    if (
      formattedMultipleVariantsOptionsValue &&
      MultipleVariants?.length === totalCombinations &&
      multipleVariantsPulled < 4 &&
      getMultipleVariantsSuccess &&
      productDetails?.HasVariant
    ) {
      const updatedVariants = MultipleVariants.map((variant) => {
        const currentValue = variant.Options.map((option) => option.Value).join(
          '-'
        );

        const foundValue = formattedMultipleVariantsOptionsValue.find(
          (value) => value.Value === currentValue
        );
        if (foundValue) {
          return {
            ...variant,
            IsActive: true,
            Inventory: foundValue.Inventory || 0,
            Price: foundValue.Price || 0,
          };
        } else {
          return variant;
        }
      });

      form.setValue('Variants', updatedVariants);
      setMultipleVariantsPulled((prev) => prev + 1);
    }
  }, [
    formattedMultipleVariantsOptionsValue,
    VariantsOptions,
    MultipleVariants,
    form,
    multipleVariantsPulled,
    formattedOptions,
    getMultipleVariantsSuccess,
    productDetails,
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

  const { append, remove } = useFieldArray({
    name: 'VariantsOptions',
    control: form.control,
  });

  const {
    fields: uploadingList,
    append: uploadingAppend,
    remove: uploadingRemove,
  } = useFieldArray({
    name: 'UploadingList',
    control: form.control,
  });

  const {
    remove: removeImage,
    append: appendImage,
    move: moveImage,
  } = useFieldArray({
    name: 'Images',
    control: form.control,
  });

  const incrementChanges = useCreateCountStore((state) => state.increment);
  const updateChanges = useCreateCountStore((state) => state.count);

  const { fields: variantSku, update: updateSku } = useFieldArray({
    name: 'Variants',
    control: form.control,
  });

  function onSubmit(values: z.infer<typeof productSchema>) {
    const filteredActiveSku = values.Variants.filter((vari) => vari.IsActive);
    const finalProduct = {
      ...values,
      Variants: hasVariants
        ? filteredActiveSku
        : [{ Price: values.Price, Inventory: values.Inventory }],
      Options: values.VariantsOptions,
    };

    if (!isUpdating) {
      createProduct(finalProduct as any);
    } else {
      // hit update product endpoint
      updateProduct({ data: finalProduct as any, productId: productId });
    }
  }

  const { errors } = form.formState;

  const generateCombinations = (
    options: {
      Name: string;
      Values: string[];
    }[],
    currentIndex = 0,
    currentCombination = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any => {
    if (currentIndex === options.length) {
      return [currentCombination];
    }

    const currentOption = options[currentIndex];
    const combinations = [];

    for (const value of currentOption.Values) {
      const nextCombination = [
        ...currentCombination,
        { OptionName: currentOption.Name, Value: value },
      ];
      combinations.push(
        ...generateCombinations(
          options,
          currentIndex + 1,
          nextCombination as never
        )
      );
    }

    return combinations;
  };

  const allCombinations = useMemo(
    () => generateCombinations(Variants),
    [Variants, updateChanges]
  );

  useEffect(() => {
    const formatedCombinations = allCombinations.map(
      (item: any, index: number) => {
        return {
          IsActive: false,
          Price: 500,
          Sku: `${item
            .map((i: any) => index + i.Value.replace(/\s/g, ''))
            .join('-')}`,
          Options: item,
          Inventory: 99,
        };
      }
    );
    form.setValue('Variants', formatedCombinations);
  }, [allCombinations, updateSku]);

  const handleImageUpload = async (e: any) => {
    e.preventDefault();

    try {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        uploadingAppend({});
      }
      const formData = new FormData();
      formData.append('ProductImage', selectedFile);
      const resposne = await ApiClientCF.put('/image/upload', formData);
      appendImage({ ImageUrl: resposne.data.ImageUrl });
      uploadingRemove(0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDrag = ({
    source,
    destination,
  }: {
    source: any;
    destination: any;
  }) => {
    if (destination) {
      moveImage(source.index, destination.index);
    }
  };

  const productDescription = useMemo(() => {
    return productDetails?.Description;
  }, [productDetails]);

  return (
    <section className="w-full max-w-[54rem] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>
                {isUpdating ? 'Update Product' : 'Create Product'}
              </CardTitle>
              <CardDescription>Enter Product Info Carefully!</CardDescription>
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

          <Card>
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

          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Media</CardTitle>
              <CardDescription>Enter images for your product.</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-red-600">{errors.Images?.message}</h3>
              <div className="flex gap-4 flex-wrap transition-all duration-200">
                <DragDropContext onDragEnd={handleDrag} key={imageUpdated}>
                  <Droppable droppableId="test-items" key={imageUpdated}>
                    {(provided, snapshot) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {productImages?.map((image, index) => (
                          <Draggable
                            key={`Images[${index}]`}
                            draggableId={`item-${index}`}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                className="relative group w-fit m-3 transition-all duration-200"
                                key={image.ImageUrl}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                              >
                                <div
                                  className={cn(
                                    'h-[170px] w-[200px] bg-gray-200 rounded flex items-center justify-center',
                                    index === 0 &&
                                      '!h-[200px] !w-[250px] border-green-300 border-[3px]'
                                  )}
                                >
                                  <img
                                    className="h-full w-full object-cover rounded"
                                    src={image.ImageUrl}
                                    alt="Product "
                                  />
                                </div>
                                <div className="rounded hidden top-0 right-0 group-hover:block w-full h-full group-hover:absolute group-hover:top-0 text-white group-hover:right-0 group-hover:bg-[#7c64c370]">
                                  <div
                                    className="p-4 cursor-pointer"
                                    {...provided.dragHandleProps}
                                  >
                                    <Grip />
                                  </div>
                                  <div className="w-full  h-[60%] flex justify-center items-center">
                                    <div
                                      onClick={() => removeImage(index)}
                                      className="flex items-center hover:bg-red-500 p-3 rounded cursor-pointer"
                                    >
                                      <Trash className="mr-2" /> Remove
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {uploadingList?.map((item, index) => (
                  <div
                    key={item.id}
                    className="h-[170px] w-[170px] flex justify-center m-3 bg-gray-100 rounded items-center"
                  >
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />{' '}
                    Uploading
                  </div>
                ))}

                <div className="grid hover:cursor-pointer m-3 h-[170px] w-[170px] border border-[gray] rounded max-w-sm items-center gap-1.5">
                  <Label
                    className="w-full hover:cursor-pointer rounded h-full bg-gray-100 flex justify-center items-center"
                    htmlFor="picture"
                  >
                    <div className="flex items-center">
                      <Plus />
                      Add Image
                    </div>
                  </Label>
                  <Input
                    onChange={handleImageUpload}
                    className="hidden"
                    id="picture"
                    name="image"
                    type="file"
                    accept="image/*"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

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
                            Check here if this product has options and variants.
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
                    {VariantsOptions.map((option, index) => {
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
                                        onClick={() => remove(index)}
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
                    })}

                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        append({
                          Name: 'Default Name',
                          Values: ['Value 1', 'Value 2'],
                        });
                      }}
                    >
                      Add More Option
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {!hasVariants && (
            <Card>
              <CardHeader className="pb-0">
                <CardTitle>Enter Single Product Price</CardTitle>
                <CardDescription>e.g. 199 BDT</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="Price"
                  render={({ field }) => (
                    <FormItem className="space-y-0 !mt-3">
                      <FormLabel>Price</FormLabel>
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

          {hasVariants && (
            <Card>
              <CardHeader className="pb-0">
                <CardTitle>
                  Enter Inventory(Quantity) / Price For Variants
                </CardTitle>
                <CardDescription>e.g. 1 Inventory, 199 BDT</CardDescription>
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
                            <FormLabel>Price</FormLabel>
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
          )}

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
        </form>
      </Form>
    </section>
  );
};

export default CreateProduct;
