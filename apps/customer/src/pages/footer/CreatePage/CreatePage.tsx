import React, { useEffect, useMemo } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, RichTextEditor, useToast } from '@customer/components/';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@customer/components/';
import { Input } from '@customer/components/';
import useTurnStileHook from '@customer/hooks/turnstile';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createPage, getPage, updatePage } from '../api';
import { Turnstile } from '@marsidev/react-turnstile';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { Route as CreatePageRoute } from '../../../routes/store/$storeKey/footer_/createpage';

export const pageSchema = z.object({
  Description: z.string().min(2).max(40000),
  Url: z
    .string()
    .min(2, {
      message: 'Url must be at least 2 characters.',
    })
    .regex(/^[a-zA-Z-]+$/, {
      message: "Url can't have special char or spaces",
    })
    .max(150),
});

const CreatePage = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };

  const { update, pageId } = useSearch({
    from: CreatePageRoute.fullPath,
  });

  const isUpdating = update && !!pageId;

  const form = useForm<z.infer<typeof pageSchema>>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      Description: '',
    },
  });

  const { toast } = useToast();

  const navigate = useNavigate();

  const { data: pageResponse } = useQuery({
    queryKey: ['getPage', pageId],
    queryFn: () => getPage(pageId || 0),
    enabled: !!pageId,
  });

  const page = pageResponse?.Data;

  const { mutate: handleCreatePage, isPending: isPendingCreate } = useMutation({
    mutationFn: createPage,
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Page',
        description: 'Page Created',
      });
      navigate({ to: '/store/$storeKey/footer', params: { storeKey } });
    },
  });

  const { mutate: handleUpdatePage, isPending: isPendingUpdate } = useMutation({
    mutationFn: updatePage,
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Page',
        description: 'Page Updated',
      });
      navigate({ to: '/store/$storeKey/footer', params: { storeKey } });
    },
  });

  useEffect(() => {
    if (page?.Description) {
      form.setValue('Description', page.Description);
      form.setValue('Url', page.Url);
    }
  }, [page]);

  function onSubmit(
    values: z.infer<typeof pageSchema>,
    turnstileResponse: string | null
  ) {
    if (!isUpdating) {
      handleCreatePage({
        ...values,
        'cf-turnstile-response': turnstileResponse,
      });
    }

    if (isUpdating) {
      handleUpdatePage({
        id: pageId,
        data: {
          ...values,
          'cf-turnstile-response': turnstileResponse,
        },
      });
    }
  }

  const isPending = isPendingCreate || isPendingUpdate;

  const forceUpdate = () => {
    window.location.reload();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormWrapper = (e: any) => {
    e.preventDefault();
    try {
      const tRes = e.target['cf-turnstile-response'].value;

      if (!tRes) return;

      form.handleSubmit((values: z.infer<typeof pageSchema>) =>
        onSubmit(values, tRes)
      )(e);
    } catch (error) {
      forceUpdate();
    }
  };

  const { errors: formErrors } = form.formState;

  const [turnstileLoaded] = useTurnStileHook();

  const url = form.watch('Url');

  const description = useMemo(() => {
    return page?.Description;
  }, [page]);

  return (
    <section className="w-full min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <Card>
        <CardHeader>
          <CardTitle>{isUpdating ? 'Update' : 'Create'} Page</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleFormWrapper} className="space-y-8">
              <FormField
                control={form.control}
                name="Url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Url</FormLabel>
                    <FormControl>
                      <Input placeholder="page url" {...field} />
                    </FormControl>
                    <FormDescription>yourdomain.com/page/{url}</FormDescription>
                    <FormDescription>
                      eg. about-us, terms-and-conditions, prvacy-policy
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormLabel className="mt-5">Page Content</FormLabel>
              <p className="text-red-500">{formErrors.Description?.message}</p>
              {!isUpdating && (
                <RichTextEditor
                  onValChange={(data) => {
                    form.setValue('Description', JSON.stringify(data));
                  }}
                />
              )}

              {description && isUpdating && (
                <RichTextEditor
                  initialVal={description}
                  onValChange={(data) =>
                    form.setValue('Description', JSON.stringify(data))
                  }
                />
              )}

              <Turnstile
                options={{ size: 'auto' }}
                siteKey="0x4AAAAAAAQW6BNxMGjPxRxa"
              />

              <Button type="submit" disabled={!turnstileLoaded}>
                {!turnstileLoaded && (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    wait a few moment..
                  </>
                )}
                {turnstileLoaded && (
                  <span>
                    {isPending && 'Processing..'}{' '}
                    {isUpdating ? 'Update' : 'Create'}
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default CreatePage;
