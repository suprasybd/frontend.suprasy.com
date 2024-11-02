import { useEffect, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
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
import Logo from './Logo';
import { Eye, EyeOff } from 'lucide-react';

const formSchema = z.object({
  TurnstileKey: z.string().min(2).max(100),
  TurnstileSecret: z.string().min(2).max(100),
});

const TurnstileComponent = () => {
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
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Turnstile',
        description: response.response.data.Message,
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

  const [showKeys, setShowKeys] = useState({
    TurnstileKey: false,
    TurnstileSecret: false,
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
    <section>
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
                  <div className="relative">
                    <Input
                      type={showKeys.TurnstileKey ? 'text' : 'password'}
                      placeholder="Turnstile Key"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowKeys((prev) => ({
                          ...prev,
                          TurnstileKey: !prev.TurnstileKey,
                        }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showKeys.TurnstileKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
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
                  <div className="relative">
                    <Input
                      type={showKeys.TurnstileSecret ? 'text' : 'password'}
                      placeholder="Turnstile Secret"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowKeys((prev) => ({
                          ...prev,
                          TurnstileSecret: !prev.TurnstileSecret,
                        }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showKeys.TurnstileSecret ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
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

const Turnstile = () => {
  return (
    <div>
      <section className="w-full min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
        <Tabs defaultValue="turnstile" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="turnstile">Turnstile</TabsTrigger>
            <TabsTrigger value="logo">Logo</TabsTrigger>
          </TabsList>
          <TabsContent value="turnstile">
            <TurnstileComponent />
          </TabsContent>
          <TabsContent value="logo">
            <Logo />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Turnstile;
