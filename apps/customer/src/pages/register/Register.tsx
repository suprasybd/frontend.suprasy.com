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
} from '@frontend.suprasy.com/ui';
import { useMutation } from '@tanstack/react-query';
import { register } from './api';
import { ReloadIcon } from '@radix-ui/react-icons';

const Register: React.FC = () => {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { Password: '', Email: '' },
  });

  const { toast } = useToast();
  const formErrors = form.formState;

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      toast({
        title: 'Registration succecssfull',
        description: 'We have sent you an verification email!',
        variant: 'destructive',
      });
    },
    onError: (data) => {
      toast({
        title: 'Register Failed',
        description: 'Incorrect credintial provided!',
        variant: 'destructive',
      });
    },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    loginMutation(values);
  }

  return (
    <div className="flex min-h-full  flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="FirstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      FormError={!!formErrors.errors.FirstName}
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
              name="LastName"
              render={({ field }) => (
                <FormItem className="space-y-0 !mt-3">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      FormError={!!formErrors.errors.LastName}
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
              name="Email"
              render={({ field }) => (
                <FormItem className="space-y-0 !mt-3">
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
              className="w-full "
              variant={'defaultGradiant'}
            >
              {isPending && (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Loging In..
                </>
              )}
              {!isPending && <>Register</>}
            </Button>
          </form>
        </Form>

        <p className="mt-10 text-center text-sm text-gray-500 ">
          Already registred?
          <Link
            to="/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 pl-2"
          >
            Click here to signin
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
