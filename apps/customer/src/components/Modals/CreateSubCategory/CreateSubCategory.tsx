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
  function onSubmit(values: z.infer<typeof formSchema>) {
    const turnstileResponse = localStorage.getItem('cf-turnstile-in-storage');
    handleCreateSubCateogry({
      data: {
        ...values,
        'cf-turnstile-response': turnstileResponse,
      },
      parentCategory: parentId,
    });
  }
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormWrapper = (e: any) => {
    e.preventDefault();
    try {
      const tRes = e.target['cf-turnstile-response'].value;

      if (!tRes) return;

      localStorage.setItem('cf-turnstile-in-storage', tRes);

      form.handleSubmit(onSubmit)(e);
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
        <DialogContent>
          <div className="my-2 mt-4">
            <Form {...form}>
              <form onSubmit={handleFormWrapper} className="space-y-8">
                <FormField
                  control={form.control}
                  name="CategoryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Add Sub Category</FormLabel>
                      <FormControl>
                        <Input placeholder="sub category" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Turnstile
                  options={{ size: 'auto' }}
                  siteKey="0x4AAAAAAAQW6BNxMGjPxRxa"
                />

                <div className="w-full flex justify-center gap-[7px]">
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={!turnstileLoaded}
                  >
                    {!turnstileLoaded && (
                      <>
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        wait a few moment..
                      </>
                    )}
                    {turnstileLoaded && (
                      <span>
                        {isPending ? 'Addding..' : 'Add Sub Category'}
                      </span>
                    )}
                  </Button>
                  <Button
                    className="w-full"
                    variant={'destructive'}
                    onClick={() => closeModal()}
                  >
                    Close
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
