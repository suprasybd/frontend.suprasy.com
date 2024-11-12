import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { registerSchema } from './zod/registerSchema';

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
import { register } from './api';
import { ReloadIcon } from '@radix-ui/react-icons';

import logo from '../login/assets/lg-full-blacks.png';
import useTurnStileHook from '@/hooks/turnstile';
import { Turnstile } from '@marsidev/react-turnstile';
import { Eye, EyeOff } from 'lucide-react';

const Register: React.FC = () => {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { Password: '', Email: '', FullName: '' },
  });

  const { toast } = useToast();
  const formErrors = form.formState;

  const [turnstileLoaded] = useTurnStileHook();

  const [showPassword, setShowPassword] = React.useState(false);

  const {
    mutate: registerMutation,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      toast({
        title: 'Registration successful',
        description: 'We have sent you a verification email!',
        variant: 'default',
      });
    },
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Register Failed',
        description: response.response.data.Message,
        variant: 'destructive',
      });
    },
  });

  function onSubmit(
    values: z.infer<typeof registerSchema>,
    turnstileResponse: string | null
  ) {
    registerMutation({
      ...values,
      'cf-turnstile-response': turnstileResponse,
    } as z.infer<typeof registerSchema>);
  }

  const usersEmail = form.watch('Email');

  const forceUpdate = () => {
    window.location.reload();
  };

  const handleFormWrapper = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const tRes = (e.target as any)['cf-turnstile-response'].value;

      if (!tRes) return;

      form.handleSubmit((values: z.infer<typeof registerSchema>) =>
        onSubmit(values, tRes)
      )(e);
    } catch (error) {
      forceUpdate();
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center md:px-6 md:py-12 lg:px-8">
      <div className="bg-white p-6 md:p-12 rounded-2xl shadow-xl max-w-md w-full mx-auto">
        {!isSuccess && (
          <div>
            <div className="sm:mx-auto sm:w-full">
              <div className="w-full flex justify-center mb-6">
                <a
                  href="https://suprasy.com"
                  rel="noopener noreferrer"
                  className="cursor-pointer"
                >
                  <img
                    width={200}
                    height="auto"
                    src={logo}
                    alt="logo"
                    className="h-12 object-contain"
                  />
                </a>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  Create your account
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Get started with your ecommerce journey
                </p>
              </div>
            </div>

            <div className="w-full">
              <Form {...form}>
                <form onSubmit={handleFormWrapper} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="FullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="h-11"
                            FormError={!!formErrors.errors.FullName}
                            placeholder="Enter your full name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="h-11"
                            FormError={!!formErrors.errors.Email}
                            placeholder="Enter your email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              className="h-11"
                              FormError={!!formErrors.errors.Password}
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Create a password"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? (
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

                  <Turnstile
                    options={{ size: 'auto' }}
                    siteKey="0x4AAAAAAAQW6BNxMGjPxRxa"
                  />

                  <Button
                    type="submit"
                    className="w-full h-11 font-medium"
                    disabled={!turnstileLoaded}
                    variant={'defaultGradiant'}
                  >
                    {!turnstileLoaded && (
                      <>
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        Please wait...
                      </>
                    )}

                    {turnstileLoaded && (
                      <>
                        {isPending && (
                          <>
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        )}
                        {!isPending && <>Create account</>}
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 space-y-2 text-center text-sm text-gray-500">
                <p>
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-medium text-primary hover:text-primary/80"
                  >
                    Sign in
                  </Link>
                </p>
                <p>
                  <Link
                    to="/forgotpassword"
                    className="font-medium text-primary hover:text-primary/80"
                  >
                    Forgot password?
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        {isSuccess && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Verification Email Sent
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              We've sent a verification link to{' '}
              <span className="font-medium text-primary">{usersEmail}</span>
            </p>
            <Link
              to="/login"
              className="inline-flex w-full justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90 shadow-sm"
            >
              Continue to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
