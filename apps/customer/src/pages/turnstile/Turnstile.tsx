import { useEffect } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  useToast,
} from '@customer/components';
import { Link, useParams } from '@tanstack/react-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@customer/components/index';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@customer/components/index';
import { Input } from '@customer/components/index';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getTurnstile, updateTurnstile } from './api';

const formSchema = z.object({
  TurnstileKey: z.string().min(2).max(100),
  TurnstileSecret: z.string().min(2).max(100),
});

const Turnstile = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };
  const { toast } = useToast();
  const { data: trunstileResponse, refetch } = useQuery({
    queryKey: ['getTurnstile'],
    queryFn: getTurnstile,
  });

  const { mutate: handleUpdateTurnstile, isPending } = useMutation({
    mutationFn: updateTurnstile,
    onSuccess: () => {
      refetch();
      toast({
        title: 'Trunstile',
        description: 'done',
        variant: 'default',
      });
    },
    onError: () => {
      toast({
        title: 'Trunstile',
        description: 'save failed!',
        variant: 'destructive',
      });
    },
  });

  const turnstileData = trunstileResponse?.Data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      TurnstileKey: '',
      TurnstileSecret: '',
    },
  });

  useEffect(() => {
    if (turnstileData) {
      form.setValue('TurnstileKey', turnstileData.TurnstileKey);
      form.setValue('TurnstileSecret', turnstileData.TurnstileSecret);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnstileData]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleUpdateTurnstile(values);
  }

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
              to="/store/$storeKey/turnstile"
              params={{ storeKey: storeKey }}
            >
              Turnstile
            </Link>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* form */}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-[500px]"
        >
          <FormField
            control={form.control}
            name="TurnstileKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Turnstile Key</FormLabel>
                <FormControl>
                  <Input placeholder="Turnstile Key" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="TurnstileSecret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Turnstile Secret</FormLabel>
                <FormControl>
                  <Input placeholder="Turnstile Secret" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? 'Saving..' : 'Save'}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default Turnstile;
