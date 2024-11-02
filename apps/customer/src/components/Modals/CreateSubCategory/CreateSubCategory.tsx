import { useModalStore } from '@customer/store/modalStore';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
} from '@customer/components/index';
import {
  Input,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@customer/components/index';
import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { addSubCategory } from '@customer/pages/categories/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import useTurnStileHook from '@customer/hooks/turnstile';
import { Turnstile } from '@marsidev/react-turnstile';
import { ReloadIcon } from '@radix-ui/react-icons';
const formSchema = z.object({
  CategoryName: z.string().min(2).max(50),
});

const CreateSubCategory: React.FC = () => {
  const { modal, clearModalPath } = useModalStore((state) => state);
  const modalName = modal.modal;
  const parentId = modal.parentCategoryId;
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      CategoryName: '',
    },
  });

  const { isPending, mutate: handleCreateSubCateogry } = useMutation({
    mutationFn: addSubCategory,
    onSuccess: () => {
      closeModal();
      forceUpdate();
    },
  });

  useEffect(() => {
    if (modalName === 'subcategory' && parentId) {
      setModalOpen(true);
    }
  }, [modalName, parentId]);

  const closeModal = () => {
    setModalOpen(false);
    clearModalPath();
  };

  const forceUpdate = () => {
    window.location.reload();
  };

  function onSubmit(
    values: z.infer<typeof formSchema>,
    turnstileResponse: string | null
  ) {
    handleCreateSubCateogry({
      data: {
        ...values,
        'cf-turnstile-response': turnstileResponse,
      },
      parentCategory: parentId,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormWrapper = (e: any) => {
    e.preventDefault();
    try {
      const tRes = e.target['cf-turnstile-response'].value;

      if (!tRes) return;

      form.handleSubmit((values: z.infer<typeof formSchema>) =>
        onSubmit(values, tRes)
      )(e);
    } catch (error) {
      forceUpdate();
    }
  };

  const [turnstileLoaded] = useTurnStileHook();

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
        <DialogContent className="sm:max-w-[425px]">
          <div className="space-y-6 py-4">
            <div className="flex flex-col space-y-2 text-center sm:text-left">
              <h2 className="text-lg font-semibold tracking-tight">
                Create Sub Category
              </h2>
              <p className="text-sm text-muted-foreground">
                Add a new sub-category to organize your products
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={handleFormWrapper} className="space-y-4">
                <FormField
                  control={form.control}
                  name="CategoryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter sub-category name"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="w-full">
                  <Turnstile
                    options={{ size: 'auto' }}
                    siteKey="0x4AAAAAAAQW6BNxMGjPxRxa"
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => closeModal()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!turnstileLoaded || isPending}
                    className="min-w-[100px]"
                  >
                    {!turnstileLoaded ? (
                      <div className="flex items-center gap-2">
                        <ReloadIcon className="h-4 w-4 animate-spin" />
                        <span>Loading...</span>
                      </div>
                    ) : isPending ? (
                      <div className="flex items-center gap-2">
                        <ReloadIcon className="h-4 w-4 animate-spin" />
                        <span>Creating...</span>
                      </div>
                    ) : (
                      'Create'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateSubCategory;
