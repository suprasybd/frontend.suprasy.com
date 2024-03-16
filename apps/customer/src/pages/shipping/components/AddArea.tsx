import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from '@frontend.suprasy.com/ui';
import React, { useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { addArea } from '../api';
import { areaSchema } from './Area.zod';

const AddArea: React.FC = () => {
  const form = useForm<z.infer<typeof areaSchema>>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      Cost: 50,
      Area: 'Dhaka',
    },
  });

  const { toast } = useToast();
  const closeBtn = useRef(null);
  const queryClient = useQueryClient();

  const { mutate: handleAddArea, isPending } = useMutation({
    mutationFn: addArea,
    onSuccess: (response) => {
      if (closeBtn.current) {
        (closeBtn.current as { click: () => void }).click();
      }

      void queryClient.refetchQueries({ queryKey: ['getStoreAreasZones'] });

      toast({
        title: 'Add Area',
        description: response.Message,
        variant: 'default',
      });
    },
    onError: () => {
      toast({
        title: 'Add Area',
        description: 'Add Area failed!',
        variant: 'destructive',
      });
    },
  });

  function onSubmit(values: z.infer<typeof areaSchema>) {
    handleAddArea(values);
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="my-3" variant={'gradiantT'}>
          Add Area/Zone
        </Button>
      </DialogTrigger>
      <DialogContent className="my-3">
        <h1>Add a area/zone</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="Area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area</FormLabel>
                  <FormControl>
                    <Input placeholder="Area" {...field} />
                  </FormControl>
                  <FormDescription>This is the area/zone name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Cost"
              render={({ field }) => (
                <FormItem className="!mt-0">
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Cost" {...field} />
                  </FormControl>
                  <FormDescription>This is the area/zone name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-[8px]">
              <DialogClose className="w-full" ref={closeBtn}>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    if (closeBtn.current) {
                      (closeBtn.current as { click: () => void }).click();
                    }
                  }}
                  variant={'destructive'}
                  className="w-full"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant={'gradiantT'}
                className="w-full"
                type="submit"
                disabled={isPending}
              >
                {isPending ? 'Adding Area..' : 'Add This Area'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddArea;
