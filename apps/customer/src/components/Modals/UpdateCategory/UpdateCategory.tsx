import {
  getAllCategories,
  getCategories,
} from '@customer/pages/categories/api';
import { useModalStore } from '@customer/store/modalStore';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@customer/components/index';
import cn from 'classnames';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import { updateProductCateogry } from './api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@customer/components/index';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@customer/components/index';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@customer/components/index';
import { toast } from '@customer/components/index';
const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const;

const FormSchema = z.object({
  category: z.string({
    required_error: 'Please select a category.',
  }),
});

const UpdateCategory: React.FC = () => {
  const { modal, clearModalPath } = useModalStore((state) => state);
  const modalName = modal.modal;
  const productId = modal.productId;
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    handleUpdateProductCategory({
      categoryId: parseInt(data.category),
      productId: productId as any,
    });
    // toast({
    //   title: 'You submitted the following values:',
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  }

  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  useEffect(() => {
    if (modalName === 'update-category-product' && productId) {
      setModalOpen(true);
    }
  }, [modalName, productId]);

  const closeModal = () => {
    setModalOpen(false);
    clearModalPath();
  };

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutate: handleUpdateProductCategory } = useMutation({
    mutationFn: updateProductCateogry,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['getUserStoresProductsList'] });
      toast({
        title: 'Category update',
        description: 'category update successfull',
        variant: 'default',
      });
      closeModal();
    },
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Category Update',
        description: response.response.data.Message,
        variant: 'destructive',
      });
    },
  });

  const { data: categoryResponse } = useQuery({
    queryKey: ['getCategoriesAllModal'],
    queryFn: () => getAllCategories(),
    enabled: modalOpen,
  });

  const categories = categoryResponse?.Data;

  useEffect(() => {
    if (categories && categories.length) {
      setSelectedCategory(categories[0].Id);
    }
  }, [categories]);
  const [open, setOpen] = React.useState(false);

  const categoriesFormated = useMemo(() => {
    return categories?.map((c) => ({ label: c.Name, value: c.Id.toString() }));
  }, [categories]);

  return (
    <div>
      <Dialog
        open={modalOpen}
        onOpenChange={(data) => {
          if (!data) {
            closeModal();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update category</DialogTitle>
          </DialogHeader>

          {categoriesFormated && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Categories</FormLabel>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'w-full justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? categoriesFormated.find(
                                    (c) => c.value === field.value
                                  )?.label
                                : 'Select category'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search category..." />
                            <CommandList>
                              <CommandEmpty>No category found.</CommandEmpty>
                              <CommandGroup>
                                {categoriesFormated.map((c) => (
                                  <CommandItem
                                    value={c.label}
                                    key={c.value}
                                    onSelect={() => {
                                      form.setValue('category', c.value);
                                      setOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        c.value === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {c.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        This is the cateogry that will be used for this product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="w-full flex gap-[8px] justify-center items-center">
                  <Button type="submit" className="w-full">
                    Update
                  </Button>
                  <Button className="w-full" onClick={() => closeModal()}>
                    Close
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateCategory;
