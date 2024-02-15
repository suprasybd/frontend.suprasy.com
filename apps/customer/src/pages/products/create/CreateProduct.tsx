import {
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
  Checkbox,
  FormLabel,
  FormMessage,
  Input,
  Switch,
  Textarea,
  Label,
} from '@frontend.suprasy.com/ui';
import cn from 'classnames';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grip, Plus, Trash, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import NestedValues from './components/NestedValues';
import { useCreateCountStore } from './store';
import { productSchema } from './zod/productSchema';
import { ApiClientCF } from '../../../libs/ApiClient';
import { ReloadIcon } from '@radix-ui/react-icons';

const CreateProduct: React.FC = () => {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      Description: '',
      Price: 99,
      Slug: '',
      Title: '',
      Type: '',
      VariantsOptions: [{ Name: 'Size', Options: ['xl', 'lg', 'sm'] }],
      Images: [
        {
          ImageUrl:
            'https://static.suprasy.com/08d12198-f35f-4966-acc4-96157183b92020240215154443',
        },
      ],
    },
  });

  const hasVariants = form.watch('HasVariants');
  const Variants = form.watch('VariantsOptions');

  const { fields, append, remove } = useFieldArray({
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
    fields: productImages,
    remove: removeImage,
    append: appendImage,
  } = useFieldArray({
    name: 'Images',
    control: form.control,
  });

  const incrementChanges = useCreateCountStore((state) => state.increment);
  const updateChanges = useCreateCountStore((state) => state.count);

  const {
    fields: variantSku,
    insert: insertSku,
    update: updateSku,
  } = useFieldArray({
    name: 'Variants',
    control: form.control,
  });

  function onSubmit(values: z.infer<typeof productSchema>) {
    const filteredActiveSku = values.Variants.filter((vari) => vari.IsActive);
    const finalProduct = {
      ...values,
      Variants: filteredActiveSku,
      Options: values.VariantsOptions,
    };
    console.log(finalProduct);
  }

  // const generateCombinations = (options) => {
  //   if (!options.length) return [''];

  //   const [currentOption, ...restOptions] = options;
  //   const combinations = generateCombinations(restOptions);

  //   return currentOption.Options.flatMap((value) =>
  //     combinations.map((combination) => `${value}, ${combination}`)
  //   );
  // };

  const generateCombinations = (
    options: {
      Name: string;
      Options: string[];
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

    for (const value of currentOption.Options) {
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
          Price: 3,
          Sku: `${item
            .map((i: any) => index + i.Value.replace(/\s/g, ''))
            .join('-')}`,
          Options: item,
          Inventory: index,
        };
      }
    );
    form.setValue('Variants', formatedCombinations);
    // allCombinations.forEach((item: any, index: number) => {
    //   updateSku(index, {
    //     Price: 3,
    //     Sku: `${item.map((i) => index + i.Value.replace(/\s/g, '')).join('-')}`,
    //     Inventory: index,
    //     Options: item,
    //   }); // Insert empty values for each combination
    // });
  }, [allCombinations, updateSku]);

  const handleImageUpload = async (e) => {
    e.preventDefault();

    try {
      //       productImages
      // removeImage

      uploadingAppend({});

      const selectedFile = e.target.files[0];

      const formData = new FormData();
      formData.append('ProductImage', selectedFile);
      const resposne = await ApiClientCF.put('/image/upload', formData);
      appendImage({ ImageUrl: resposne.data.ImageUrl });
      uploadingRemove(0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="w-full max-w-[54rem] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Create Product</CardTitle>
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
              <FormField
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
              />
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
              <div className="flex gap-4 flex-wrap">
                {productImages?.map((image, index) => (
                  <div className="relative group">
                    <div
                      className={cn(
                        'h-[170px] w-[170px] bg-gray-200 rounded flex items-center justify-center',
                        index === 0 && 'h-[270px] w-[350px]'
                      )}
                    >
                      <img
                        className="h-full w-full object-cover rounded"
                        src={image.ImageUrl}
                        alt="Product "
                      />
                    </div>
                    <div className="rounded hidden opacity-80 top-0 right-0 group-hover:block w-full h-full group-hover:absolute group-hover:top-0 text-white group-hover:right-0 group-hover:bg-slate-500">
                      <div className="p-4 cursor-pointer">
                        <Grip />
                      </div>
                      <div className="w-full  h-[60%] flex justify-center items-center">
                        <div className="flex items-center hover:bg-red-500 p-3 rounded cursor-pointer">
                          <Trash className="mr-2" /> Remove
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {uploadingList?.map((item, index) => (
                  <div className="h-[170px] w-[170px] flex justify-center bg-gray-100 rounded items-center">
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />{' '}
                    Uploading
                  </div>
                ))}

                <div className="grid hover:cursor-pointer h-[170px] w-[170px] border border-[gray] rounded max-w-sm items-center gap-1.5">
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
                    {fields.map((option, index) => {
                      return (
                        <Card className="mb-3">
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
                                    {Variants[index].Options.map((option) => (
                                      <span>
                                        {option && (
                                          <span className="block bg-gradient-to-r from-violet-600 to-indigo-600 px-2 w-fit rounded text-sm text-white">
                                            {option}
                                          </span>
                                        )}
                                      </span>
                                    ))}
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
                          Options: ['Value 1', 'Value 2'],
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
              </CardContent>
            </Card>
          )}

          {hasVariants && (
            <Card>
              <CardHeader className="pb-0">
                <CardTitle>Enter Sku / Price For Variants</CardTitle>
                <CardDescription>e.g. 1 Inventory, 199 BDT</CardDescription>
              </CardHeader>
              <CardContent>
                {variantSku.map((combinations, index) => (
                  <div
                    key={combinations.id}
                    className="flex items-center gap-4"
                  >
                    <div className="whitespace-nowrap">
                      <FormField
                        control={form.control}
                        name={`Variants.${index}.IsActive`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="mr-1"></FormLabel>
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="whitespace-nowrap">
                      {combinations.Options.map((option) => option.Value).join(
                        '-'
                      )}
                    </div>
                    <div>
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
                    <div>
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
                    <div>
                      <FormField
                        control={form.control}
                        name={`Variants.${index}.Sku`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel>Sku</FormLabel>
                            <FormControl>
                              <Input placeholder="Sku" {...field} />
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

          <Button type="submit" className="w-full " variant={'defaultGradiant'}>
            Create
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default CreateProduct;
