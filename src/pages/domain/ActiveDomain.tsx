import { useEffect } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  FormDescription,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from '@/components';
import { Link, useParams } from '@tanstack/react-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/index';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/index';
import { Input } from '@/components/index';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getDomains, getMainDomain, updateDomain } from '../turnstile/api';
import { Terminal } from 'lucide-react';

const formSchema = z.object({
  DomainName: z.string().min(2).max(100),
});

const ActiveDomain = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };
  const { toast } = useToast();
  const { data: domainResponse, refetch } = useQuery({
    queryKey: ['getDomain'],
    queryFn: getMainDomain,
  });

  const { data: domainsResponse } = useQuery({
    queryKey: ['getDomains'],
    queryFn: getDomains,
  });

  const domains = domainsResponse?.Data;

  const { mutate: handleUpdateDomain, isPending } = useMutation({
    mutationFn: updateDomain,
    onSuccess: () => {
      refetch();
      toast({
        title: 'Domain',
        description: 'done',
        variant: 'default',
      });
    },
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Domain',
        description: response.response.data.Message,
        variant: 'destructive',
      });
    },
  });

  const domainData = domainResponse?.Data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      DomainName: '',
    },
  });

  useEffect(() => {
    if (domainData) {
      form.setValue('DomainName', domainData.DomainName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domainData]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleUpdateDomain(values);
  }

  const watchValue = form.watch('DomainName');

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

      <Alert className="w-fit my-5">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Note!</AlertTitle>
        <AlertDescription>
          This domain name will be used when sending email from our mailling
          system for email verification system and others. You can edit it and
          make sure it's the current active domain of your site listed in the
          domains tab if you added custom domain beside free subdomain.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-[500px]"
        >
          {domains && watchValue && domains.length > 0 && (
            <FormField
              control={form.control}
              name="DomainName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currently Active Domain</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a domain" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {domains.map((d) => (
                        <SelectItem value={d.DomainName}>
                          {d.DomainName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    You can select a domain that's avaliable in the domains list
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? 'Saving..' : 'Save'}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default ActiveDomain;
