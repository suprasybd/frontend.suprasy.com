import { addDomains, getDomains } from '../turnstile/api';

import {
  Button,
  Input,
  useToast,
  Card,
  CardContent,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  Alert,
  AlertTitle,
  AlertDescription,
} from '@customer/components/index';
import { useMutation, useQuery } from '@tanstack/react-query';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Terminal } from 'lucide-react';
import { useParams } from '@tanstack/react-router';
import { getStoreDetails } from '../home/api';

const formSchema = z.object({
  DomainName: z.string().min(2).max(50),
});
const DomainList = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      DomainName: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const turnstileResponse = localStorage.getItem('cf-turnstile-in-storage');
    handleAddDomain({
      ...values,
      'cf-turnstile-response': turnstileResponse,
    });
  }

  const { toast } = useToast();

  const { data: domainsResponse, refetch } = useQuery({
    queryKey: ['getDomains'],
    queryFn: getDomains,
  });

  const { data: storeDetailsResponse } = useQuery({
    queryKey: ['getStoreDetails'],
    queryFn: () => getStoreDetails(storeKey),
    enabled: !!storeKey,
  });

  const storeDetails = storeDetailsResponse?.Data;

  const { mutate: handleAddDomain, isPending } = useMutation({
    mutationFn: addDomains,
    onSuccess: () => {
      refetch();
      toast({
        title: 'domain create',
        description: 'domain create successfull',
        variant: 'default',
      });

      form.reset();
    },
    onError: (data) => {
      toast({
        title: 'domain create',
        description: 'domain create failed',
        variant: 'destructive',
      });
    },
  });

  const domains = domainsResponse?.Data;

  return (
    <div>
      <Card>
        <CardContent>
          <div className="my-2 mt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="DomainName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Add Domain</FormLabel>
                      <Alert className="w-fit my-5">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Note!</AlertTitle>
                        <AlertDescription>
                          <p>
                            Note: don't put https:// in domain only enter raw
                            domain, example: mydomain.com, xyzstore.com etc. Add
                            cname record with value pointed to '
                            {storeDetails?.SubDomain}.suprasy.com' in dns
                            settings in your domain register site.
                          </p>
                          <p className="font-bold">STEP 1:</p>
                          <p className="">
                            Add CNAME record{' '}
                            <span className="font-bold">
                              @ or yourdomain.com
                            </span>{' '}
                            to
                            <span className="font-bold ml-1">
                              {storeDetails?.SubDomain}.suprasy.com
                            </span>
                          </p>
                          <p className="font-bold">STEP 2:</p>
                          <p className="">
                            Add your domain in the form bellow and click{' '}
                            <span className="font-bold">"Add Domain" </span>
                            button. If it's gives error try again in few minutes
                            since it takes some time for DNS records to update
                            properly.
                          </p>
                        </AlertDescription>
                      </Alert>

                      <FormControl>
                        <Input
                          placeholder="Enter Domain eg- mysite.com"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">
                  <span>{isPending ? 'Addding..' : 'Add Domain'}</span>
                </Button>
              </form>
            </Form>
          </div>

          <div className="my-4">
            <h1 className="my-2">Domain List</h1>
            {domains && domains.length > 0 && (
              <div>
                {domains.map((domain) => (
                  <p className="my-3 font-bold">{domain.DomainName}</p>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainList;
