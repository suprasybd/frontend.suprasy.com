import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/components/index';
import { PlanType } from '@/pages/home/api/types';
import { ExternalLink } from 'lucide-react';

interface SubscriptionActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedPlan: PlanType;
  currentBalance: number;
  isPending: boolean;
  isUpgrade?: boolean;
  onAddBalance: () => void;
}

const SubscriptionActionModal: React.FC<SubscriptionActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedPlan,
  currentBalance,
  isPending,
  isUpgrade,
  onAddBalance,
}) => {
  const hasEnoughBalance = currentBalance >= selectedPlan.MonthlyPrice;
  const remainingBalance = currentBalance - selectedPlan.MonthlyPrice;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isUpgrade ? 'Upgrade Subscription' : 'Add More Months'}
          </DialogTitle>
          <DialogDescription>
            {isUpgrade
              ? `Upgrade to ${selectedPlan.Name} plan`
              : 'Extend your current subscription'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan Price:</span>
              <span className="font-medium">
                {selectedPlan.MonthlyPrice} BDT
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Balance:</span>
              <span className="font-medium">{currentBalance} BDT</span>
            </div>
            {hasEnoughBalance && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Remaining Balance:
                </span>
                <span className="font-medium">{remainingBalance} BDT</span>
              </div>
            )}
          </div>

          {hasEnoughBalance ? (
            <Alert>
              <AlertTitle>Transaction Details</AlertTitle>
              <AlertDescription>
                {selectedPlan.MonthlyPrice} BDT will be deducted from your
                balance
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertTitle>Insufficient Balance</AlertTitle>
              <AlertDescription>
                You need {selectedPlan.MonthlyPrice - currentBalance} more BDT
                to {isUpgrade ? 'upgrade' : 'renew'} your subscription
              </AlertDescription>
            </Alert>
          )}

          {!hasEnoughBalance && (
            <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
              <span className="text-sm">Need more balance?</span>
              <Button
                variant="outline"
                size="sm"
                onClick={onAddBalance}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Add Balance
              </Button>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button
              disabled={!hasEnoughBalance || isPending}
              onClick={onConfirm}
              className="w-full"
            >
              {isPending
                ? 'Processing...'
                : isUpgrade
                ? 'Confirm Upgrade'
                : 'Confirm Renewal'}
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionActionModal;
