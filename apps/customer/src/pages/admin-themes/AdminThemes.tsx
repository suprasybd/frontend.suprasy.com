import React, { useState } from 'react';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Label } from '@customer/components/index';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@customer/components/index';
import { Input } from '@customer/components/index';
import AdminThemeImage from './components/Media/AdminThemeMedia';

const ImageUrl = z.object({
  ImageUrl: z.string().url(),
});

export const adminThemeSchema = z.object({
  Name: z.string().min(2).max(50),
  Description: z.string().min(2).max(50),
  R2Folder: z.string().min(2).max(50),
  Images: z.array(ImageUrl).min(1),
});

const AdminThemes = () => {
  const form = useForm<z.infer<typeof adminThemeSchema>>({
    resolver: zodResolver(adminThemeSchema),
    defaultValues: {
      Name: '',
      Description: '',
      R2Folder: '',
      Images: [],
    },
  });

  function onSubmit(values: z.infer<typeof adminThemeSchema>) {
    console.log(values);
  }

  return (
    <div className="px-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme Name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme Description</FormLabel>
                <FormControl>
                  <Input placeholder="description" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="R2Folder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>R2 Folder path</FormLabel>
                <FormControl>
                  <Input placeholder="folder patch r2" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <AdminThemeImage fieldIndex={1} form={form} />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminThemes;
