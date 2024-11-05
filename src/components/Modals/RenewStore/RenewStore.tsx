import { useModalStore } from '@/store/modalStore';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@/components/index';
import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPlan, getUserBalance, renewSubscription } from '@/pages/home/api';

import { Alert, AlertDescription, AlertTitle } from '@/components/index';
import { MONTHLY_COST } from '@/config/api';

const RenewStore: React.FC = () => {
  const { modal, clearModalPath } = useModalStore((state) => state);
  const modalName = modal.modal;
  const storeKey = modal.storeKey as string;
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { toast } = useToast();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (modalName === 'renew-store' && storeKey) {
      setModalOpen(true);
    }
  }, [modalName, storeKey]);

  const closeModal = () => {
    setModalOpen(false);
    clearModalPath();
  };

  const { data: planResponse, isSuccess } = useQuery({
    queryKey: ['getPlan'],
    queryFn: getPlan,
    enabled: modalOpen,
  });
  const { data: balanceResponse, isSuccess: balanceSuccess } = useQuery({
    queryKey: ['getUserBalance'],
    queryFn: getUserBalance,
    enabled: modalOpen,
  });

  const planData = planResponse?.Data;
  const balance = balanceResponse?.Data;

  const { mutate: hanldeRenewStore, isPending } = useMutation({
    mutationFn: renewSubscription,
    onSuccess: () => {
      toast({
        title: 'store renew',
        description: 'store renew request sent successfully',
        variant: 'default',
      });
      queryClient.refetchQueries({ queryKey: ['getUserStoresList'] });

      closeModal();
    },
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Renew Subscription',
        description: response.response.data.Message,
        variant: 'destructive',
      });
    },
  });

  const haveBalance = useMemo(() => {
    if (balance && planData) {
      if (balance.Balance >= planData.MonthlyCharge) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }, [balance, planData]);

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renew Store</DialogTitle>
            <DialogDescription>Renew Store</DialogDescription>
          </DialogHeader>

          {balanceSuccess && balance && planData && (
            <div>
              {haveBalance ? (
                <Alert>
                  <AlertTitle>Transaction Details</AlertTitle>
                  <AlertDescription>
                    {isSuccess && (
                      <div>
                        <div>
                          {MONTHLY_COST} BDT will be deducted from your balance
                        </div>
                        {balanceSuccess && balance && planData && (
                          <div>
                            Remaining balance will be :{' '}
                            {balance?.Balance - MONTHLY_COST}
                          </div>
                        )}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant={'destructive'}>
                  <AlertTitle>Not enough balance</AlertTitle>
                  <AlertDescription>
                    You don't have enought balance.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <Button
            disabled={!haveBalance}
            onClick={() => {
              hanldeRenewStore(storeKey);
            }}
            type="submit"
            className="w-full"
          >
            {isPending && 'Processing...'}
            {!isPending && 'Renew'}
          </Button>

          <Button variant={'destructive'} onClick={() => closeModal()}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RenewStore;
