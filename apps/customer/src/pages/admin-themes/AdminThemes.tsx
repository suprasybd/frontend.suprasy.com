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
import { useMutation, useQuery } from '@tanstack/react-query';
import { createTheme, getThemes, updateTheme } from './api';

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

  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [themeId, setThemeId] = useState<number>(0);

  const { mutate: createThemeMutate } = useMutation({
    mutationFn: createTheme,
  });

  const { mutate: updateThemeMutate } = useMutation({
    mutationFn: updateTheme,
  });

  const { data: themeResponse } = useQuery({
    queryKey: ['getThemesList'],
    queryFn: getThemes,
  });

  function onSubmit(values: z.infer<typeof adminThemeSchema>) {
    const images = values.Images.map((i) => i.ImageUrl);
    const updatedValue = {
      ...values,
      Images: images,
    };
    if (isUpdating) {
      updateThemeMutate({ data: updatedValue, themeId: themeId });
    } else {
      createThemeMutate(updatedValue);
    }
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

          <Button type="submit">{isUpdating ? 'Update' : 'Create'}</Button>
        </form>
      </Form>

      {themeResponse?.Data?.map((theme) => (
        <div className="p-3 border-2 border-gray-600 rounded-md mt-3">
          <h1>Name: {theme.Name}</h1>
          <p>Description: {theme.Description}</p>
          <p>R2Folder: {theme.R2Folder}</p>
          <div className="flex flex-wrap gap-[10px]">
            {theme.Images.map((i) => (
              <img
                src={i.ImageUrl}
                alt="theme"
                className="w-[300px] h-[300px]"
              />
            ))}
          </div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              form.setValue('Images', theme.Images);
              form.setValue('Description', theme.Description);
              form.setValue('Name', theme.Name);
              form.setValue('R2Folder', theme.R2Folder);
              setThemeId(theme.Id);
              setIsUpdating(true);
            }}
          >
            Update
          </Button>
        </div>
      ))}
    </div>
  );
};

export default AdminThemes;
