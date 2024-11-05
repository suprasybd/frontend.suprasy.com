import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { resetPasswordSchema } from './zod/passwordResetSchema';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from '@/components/index';
import { useMutation } from '@tanstack/react-query';
import { resetCompletePassword } from './api';
import { ReloadIcon } from '@radix-ui/react-icons';

import logo from '../login/assets/lg-full-blacks.png';
import useTurnStileHook from '@/hooks/turnstile';
import { Turnstile } from '@marsidev/react-turnstile';
import { useParams } from '@tanstack/react-router';

const PasswordReset: React.FC = () => {
  const { code } = useParams({ strict: false }) as { code: string };
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { Password: '' },
  });

  const { toast } = useToast();
  const formErrors = form.formState;

  const {
    mutate: completePasswordReset,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: resetCompletePassword,
    onSuccess: (data) => {
      toast({
        title: 'password reset complete',
        description: 'password reset complete',
        variant: 'default',
      });
    },
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Password Reset',
        description: response.response.data.Message,
        variant: 'destructive',
      });
    },
  });

  function onSubmit(
    values: z.infer<typeof resetPasswordSchema>,
    turnstileResponse: string | null
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    completePasswordReset({
      ...values,
      'cf-turnstile-response': turnstileResponse,
      Code: code,
    } as any);
  }

  const forceUpdate = () => {
    window.location.reload();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormWrapper = (e: any) => {
    e.preventDefault();
    try {
      const tRes = e.target['cf-turnstile-response'].value;

      if (!tRes) return;

      form.handleSubmit((values: z.infer<typeof resetPasswordSchema>) =>
        onSubmit(values, tRes)
      )(e);
    } catch (error) {
      forceUpdate();
    }
  };
  const [turnstileLoaded] = useTurnStileHook();

  return (
    <div className="flex min-h-full mt-20 md:mt-0 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="bg-white p-4 md:p-20  rounded-2xl">
        {!isSuccess && (
          <div>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <div className="w-full flex justify-center">
                <img width={'250px'} height={'auto'} src={logo} alt="logo" />
              </div>
              <h2 className="mt-10  text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Password Reset
              </h2>
              <p>Reset your password form here. </p>
            </div>

            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
              <Form {...form}>
                <form onSubmit={handleFormWrapper} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="Password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            className="h-14"
                            FormError={!!formErrors.errors.Password}
                            placeholder="New Password"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Turnstile
                    options={{ size: 'auto' }}
                    siteKey="0x4AAAAAAAQW6BNxMGjPxRxa"
                  />

                  <Button
                    type="submit"
                    className="w-full h-11"
                    variant={'defaultGradiant'}
                    disabled={!turnstileLoaded}
                  >
                    {!turnstileLoaded && (
                      <>
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        wait a few moment..
                      </>
                    )}

                    {turnstileLoaded && (
                      <>
                        {isPending && (
                          <>
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            Emailing Reset Link..
                          </>
                        )}
                        {!isPending && <>Reset Password</>}
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <p className="mt-10 text-center text-sm text-gray-500 ">
                Already registred?
                <a
                  href="/login"
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 pl-2"
                >
                  Click here to signin
                </a>
              </p>
            </div>
          </div>
        )}
        {isSuccess && (
          <div className="relative flex flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white">
            <div className="max-w-xl px-5 text-center">
              <h2 className="mb-2 text-[42px] font-bold text-zinc-800">
                Password Reset Complete
              </h2>
              <p className="mb-2 text-lg text-zinc-500">
                Password reset complete, you can login with new password .
              </p>
              <a
                href="/login"
                className="mt-3 inline-block w-96 rounded bg-indigo-600 px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700"
              >
                Continue To Login →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;
