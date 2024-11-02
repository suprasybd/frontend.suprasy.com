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
    .regex(
      /^(pending|unverified|confirmed|shipped|completed|cancled|returned)$/,
      {
        message: 'Invalid status',
      }
    )
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
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Order Update',
        description: response.response.data.Message,
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
        <DialogContent key={ordersDetails?.Status} className="max-w-[500px]">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-semibold">
              Update Order Information
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Update the order status and add optional notes
            </p>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {orderResposne?.Data.Status && (
                <FormField
                  control={form.control}
                  name="Status"
                  defaultValue={orderResposne.Data.Status}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Order Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="unverified">Unverified</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancled">Cancelled</SelectItem>
                          <SelectItem value="returned">Returned</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="Note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Note</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add a note about this order update (optional)"
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This note will be visible to the user
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-3 pt-2">
                <Button variant="default" type="submit" className="h-11">
                  Update Order
                </Button>
                <Button
                  variant="outline"
                  onClick={() => closeModal()}
                  className="h-11"
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateOrder;
