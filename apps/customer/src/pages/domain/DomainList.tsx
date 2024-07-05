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
import useTurnStileHook from '@customer/hooks/turnstile';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Turnstile } from '@marsidev/react-turnstile';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Terminal } from 'lucide-react';

const formSchema = z.object({
  DomainName: z.string().min(2).max(50),
});
const DomainList = () => {
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
      forceUpdate();
    },
    onError: () => {
      toast({
        title: 'domain create',
        description: 'domain create failed',
        variant: 'destructive',
      });
    },
  });

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

  const domains = domainsResponse?.Data;

  return (
    <div>
      <Card>
        <CardContent>
          <div className="my-2 mt-4">
            <Form {...form}>
              <form onSubmit={handleFormWrapper} className="space-y-8">
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
                            cname record in dns settings in your domain register
                            site.
                          </p>
                        </AlertDescription>
                      </Alert>

                      <FormControl>
                        <Input placeholder="domain eg- mysite.com" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                    <span>{isPending ? 'Addding..' : 'Add Domain'}</span>
                  )}
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
