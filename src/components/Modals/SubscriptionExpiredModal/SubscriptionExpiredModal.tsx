import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
} from '@/components/index';
import { AlertTriangle, CreditCard } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface SubscriptionExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeKey: string;
}

const SubscriptionExpiredModal: React.FC<SubscriptionExpiredModalProps> = ({
  isOpen,
  onClose,
  storeKey,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Subscription Expired</DialogTitle>
          </div>
          <DialogDescription className="pt-3">
            Your subscription has expired. While your store website remains
            active, you cannot access the admin dashboard until you renew your
            subscription.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Link
            to="/store/$storeKey/subscription"
            params={{ storeKey }}
            className="w-full"
          >
            <Button className="w-full gap-2">
              <CreditCard className="h-4 w-4" />
              Renew Subscription
            </Button>
          </Link>
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionExpiredModal;
