import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@tanstack/react-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { loginSchema } from './zod/loginSchema';

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
import { login } from './api';
import { ReloadIcon } from '@radix-ui/react-icons';

import logo from './assets/lg-full-blacks.png';
import useTurnStileHook from '@/hooks/turnstile';
import { Turnstile } from '@marsidev/react-turnstile';
import { Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { Password: '', Email: '' },
  });

  const { toast } = useToast();
  const formErrors = form.formState;

  const [turnstileLoaded] = useTurnStileHook();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      navigate({
        to: '/',
      });
    },
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Login Failed',
        description: response.response.data.Message,
        variant: 'destructive',
      });
      forceUpdate();
    },
  });

  function onSubmit(
    values: z.infer<typeof loginSchema>,
    turnstileResponse: string | null
  ) {
    loginMutation({
      ...values,
      'cf-turnstile-response': turnstileResponse,
    } as z.infer<typeof loginSchema>);
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

      form.handleSubmit((values: z.infer<typeof loginSchema>) =>
        onSubmit(values, tRes)
      )(e);
    } catch (error) {
      forceUpdate();
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center md:px-6 md:py-12 lg:px-8">
      <div className="bg-white p-6 md:p-12 rounded-2xl shadow-xl max-w-md w-full mx-auto">
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
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account to continue
            </p>
          </div>
        </div>

        <div className="w-full">
          <Form {...form}>
            <form onSubmit={handleFormWrapper} className="space-y-6">
              <FormField
                control={form.control}
                name="Email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
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
                          placeholder="Enter your password"
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

              <div className="mt-2 text-right">
                <Link
                  to="/forgotpassword"
                  className="text-sm font-medium text-primary hover:text-primary/80"
                >
                  Forgot password?
                </Link>
              </div>

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
                        Signing in...
                      </>
                    )}
                    {!isPending && <>Sign in</>}
                  </>
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
