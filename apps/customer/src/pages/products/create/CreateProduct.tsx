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
  FormLabel,
  FormMessage,
  Input,
  Switch,
  Textarea,
} from '@frontend.suprasy.com/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import React, { useEffect, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import NestedValues from './components/NestedValues';
import { useCreateCountStore } from './store';
import { productSchema } from './zod/productSchema';
const CreateProduct: React.FC = () => {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      Description: '',
      Price: '99',
      Slug: '',
      Title: '',
      Type: '',
      VariantsOptions: [{ Name: 'Size', Options: ['xl', 'lg', 'sm'] }],
    },
  });

  const hasVariants = form.watch('HasVariants');
  const Variants = form.watch('VariantsOptions');

  const { fields, append, remove } = useFieldArray({
    name: 'VariantsOptions',
    control: form.control,
  });

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
    console.log(values);
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
    allCombinations.forEach((item: any, index: number) => {
      updateSku(index, {
        Price: 3,
        Sku: `${item.map((i) => index + i.Value.replace(/\s/g, '')).join('-')}`,
        Inventory: index,
        Options: item,
      }); // Insert empty values for each combination
    });
  }, [allCombinations, updateSku]);

  // console.log('sku', variantSku);
  // console.log('all raw', allRaw);
  // console.log('all memo', allCombinations);

  console.log(variantSku);
  // console.log('sku', variants);

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
                                          <span className="block bg-gradient-to-r from-violet-600 to-indigo-600 p-2 w-fit rounded text-sm text-white">
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
                    <div>
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
