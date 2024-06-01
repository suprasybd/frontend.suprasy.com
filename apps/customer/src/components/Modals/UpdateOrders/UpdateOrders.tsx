import { useModalStore } from '@customer/store/modalStore';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  useToast,
} from '@customer/components/index';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateOrder } from './api';
import { getOrderById } from '@customer/pages/orders/api';

const formSchema = z.object({
  Status: z
    .string()
    .min(2)
    .regex(/^(pending|confirmed|shipped|completed|cancled|returned)$/, {
      message: 'Invalid status',
    })
    .max(150),
  Note: z.string().optional(),
});

const UpdateOrder: React.FC = () => {
  const { modal, clearModalPath } = useModalStore((state) => state);

  const modalName = modal.modal;
  const orderId = modal.OrderId;
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { data: orderResposne } = useQuery({
    queryFn: () => getOrderById(orderId.toString()),
    queryKey: ['getOrderDetailsForUpdateOrder', orderId],
    enabled: !!orderId,
  });

  const ordersDetails = orderResposne?.Data;

  const queryClient = useQueryClient();

  const { mutate: handleOrderUpdate } = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      toast({
        title: 'Order update',
        description: 'Order update successfull',
        variant: 'default',
      });
      closeModal();
      queryClient.refetchQueries({ queryKey: ['getStoreOrders'] });
    },
    onError: () => {
      toast({
        title: 'Order update',
        description: 'Order update failed!',
        variant: 'destructive',
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleOrderUpdate({
      orderId: orderId as number,
      note: values.Note || ' ',
      status: values.Status,
    });
  }

  useEffect(() => {
    if (modalName === 'update-order' && orderId) {
      setModalOpen(true);
    }
  }, [modalName, orderId]);

  useEffect(() => {
    if (ordersDetails && ordersDetails?.Status) {
      form.setValue('Status', ordersDetails?.Status);
    }
    // eslint-disable-next-line
  }, [ordersDetails?.Status]);

  const closeModal = () => {
    setModalOpen(false);
    clearModalPath();
  };

  return (
    <div>
      <Dialog
        open={modalOpen}
        onOpenChange={(data) => {
          if (!data) {
            closeModal();
          }
        }}
      >
        <DialogContent key={ordersDetails?.Status}>
          <DialogHeader>
            <DialogTitle>Update order information</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="Status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancled">Cancled</SelectItem>
                        <SelectItem value="returned">Returned</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Textarea placeholder="note (optional)" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a note for the user (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button variant={'gradiantT'} type="submit" className="w-full">
                Update Order
              </Button>
              <Button
                className="w-full !mt-3"
                variant={'default'}
                onClick={() => closeModal()}
              >
                Close
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateOrder;
