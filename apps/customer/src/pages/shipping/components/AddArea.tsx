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
} from '@customer/components/index';
import React, { useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { addArea, getAreasById, updateArea } from '../api';
import { areaSchema } from './Area.zod';
import { useShippingStore } from './shippingStore';
import { Turnstile } from '@marsidev/react-turnstile';
import { ReloadIcon } from '@radix-ui/react-icons';
import useTurnStileHook from '@customer/hooks/turnstile';

const AddArea: React.FC = () => {
  const form = useForm<z.infer<typeof areaSchema>>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      Cost: 50,
      Area: 'Dhaka',
    },
  });

  const isModalOpen = useShippingStore((state) => state.isModalOpen);
  const toggleModal = useShippingStore((state) => state.toggleModal);
  const clearParams = useShippingStore(
    (state) => state.clearShippingModalParams
  );

  const update = useShippingStore((state) => state.params).update;
  const areaId = useShippingStore((state) => state.params).areaId;

  const { toast } = useToast();
  const closeBtn = useRef(null);
  const queryClient = useQueryClient();

  const { data: areaDataResponse } = useQuery({
    queryKey: ['getAreaDeatils', areaId],
    queryFn: () => getAreasById(areaId || 0),
    enabled: !!areaId,
  });

  const areaData = areaDataResponse?.Data;

  useEffect(() => {
    if (areaData) {
      form.setValue('Cost', areaData.Cost);
      form.setValue('Area', areaData.Area);
    }
  }, [areaData, form]);

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

  const { mutate: handleUpdateArea, isPending: isUpdating } = useMutation({
    mutationFn: updateArea,
    onSuccess: (response) => {
      if (closeBtn.current) {
        (closeBtn.current as { click: () => void }).click();
      }

      void queryClient.refetchQueries({ queryKey: ['getStoreAreasZones'] });

      toast({
        title: 'Update Area',
        description: response.Message,
        variant: 'default',
      });
    },
    onError: () => {
      toast({
        title: 'Update Area',
        description: 'Update Area failed!',
        variant: 'destructive',
      });
    },
  });

  function onSubmit(values: z.infer<typeof areaSchema>) {
    const turnstileResponse = localStorage.getItem('cf-turnstile-in-storage');
    if (update) {
      handleUpdateArea({
        Id: areaId,
        ...values,
        'cf-turnstile-response': turnstileResponse,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    } else {
      handleAddArea({
        ...values,
        'cf-turnstile-response': turnstileResponse,
      } as z.infer<typeof areaSchema>);
    }
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

      localStorage.setItem('cf-turnstile-in-storage', tRes);

      form.handleSubmit(onSubmit)(e);
    } catch (error) {
      forceUpdate();
    }
  };

  const [turnstileLoaded] = useTurnStileHook();

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(data) => {
        if (!data) {
          clearParams();
          toggleModal();
        }
      }}
    >
      <DialogTrigger onClick={() => toggleModal()}>
        <Button className="my-3" variant={'gradiantT'}>
          Add Area/Zone
        </Button>
      </DialogTrigger>
      <DialogContent className="my-3">
        <h1>{!update ? 'Add' : 'Update'} area/zone</h1>
        <Form {...form}>
          <form onSubmit={handleFormWrapper} className="space-y-8">
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

            <Turnstile
              options={{ size: 'auto' }}
              siteKey="0x4AAAAAAAQW6BNxMGjPxRxa"
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
                  variant={'outline'}
                  className="w-full"
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button
                variant={'defaultGradiant'}
                className="w-full"
                type="submit"
                disabled={isPending || isUpdating || !turnstileLoaded}
              >
                {!turnstileLoaded && (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    wait a few moment..
                  </>
                )}
                {turnstileLoaded && (
                  <span>
                    {isPending || isUpdating
                      ? `${update ? 'Updating' : 'Adding'} Area..`
                      : `${update ? 'Update' : 'Add'} This Area`}
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddArea;
