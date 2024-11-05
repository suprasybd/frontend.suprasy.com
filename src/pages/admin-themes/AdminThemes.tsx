import React, { useState } from 'react';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Label } from '@/components/index';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/index';
import { Input } from '@/components/index';
import AdminThemeImage from './components/Media/AdminThemeMedia';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createTheme, getThemes, updateTheme } from './api';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/index';

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
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            {isUpdating ? 'Update Theme' : 'Create New Theme'}
          </CardTitle>
          <CardDescription>
            Configure your theme settings and upload images
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter theme name" {...field} />
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
                      <Input placeholder="Enter theme description" {...field} />
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
                    <FormLabel>R2 Folder Path</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter R2 folder path" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AdminThemeImage fieldIndex={1} form={form} />

              <Button type="submit" className="w-full">
                {isUpdating ? 'Update Theme' : 'Create Theme'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {themeResponse?.Data?.map((theme) => (
        <Card key={theme.Id} className="mb-4">
          <CardHeader>
            <CardTitle>{theme.Name}</CardTitle>
            <CardDescription>{theme.Description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label className="text-sm font-medium">R2 Folder:</Label>
              <p className="text-muted-foreground">{theme.R2Folder}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {theme.Images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg"
                >
                  <img
                    src={image.ImageUrl}
                    alt={`Theme ${theme.Name} - Image ${index + 1}`}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
                  />
                </div>
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
              className="mt-4"
              variant="outline"
            >
              Edit Theme
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminThemes;
