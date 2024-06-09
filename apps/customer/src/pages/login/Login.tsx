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
} from '@customer/components/index';
import { useMutation } from '@tanstack/react-query';
import { login } from './api';
import { ReloadIcon } from '@radix-ui/react-icons';

import logo from './assets/lg-full-blacks.png';

const Login: React.FC = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { Password: '', Email: '' },
  });

  const { toast } = useToast();
  const formErrors = form.formState;

  const navigate = useNavigate();

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      navigate({
        to: '/',
      });
    },
    onError: (data) => {
      toast({
        title: 'Login Failed',
        description: 'Incorrect credintial provided!',
        variant: 'destructive',
      });
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    loginMutation(values);
  }

  return (
    <div className="flex min-h-full  flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img width={'250px'} height={'auto'} src={logo} alt="logo" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="Email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      FormError={!!formErrors.errors.Email}
                      placeholder="email"
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
                <FormItem className="space-y-0 !mt-3">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      FormError={!!formErrors.errors.Password}
                      type="password"
                      placeholder="password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-11"
              variant={'defaultGradiant'}
            >
              {isPending && (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Loging In..
                </>
              )}
              {!isPending && <>Login</>}
            </Button>
          </form>
        </Form>

        <p className="mt-10 text-center text-sm text-gray-500 ">
          Not a member?
          <Link
            to="/register"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 pl-2"
          >
            Click here to signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
