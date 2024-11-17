import React from 'react';
import {
  Alert,
  AlertTitle,
  AlertDescription,
  Button,
} from '@/components/index';
import { CreditCard } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface SubscriptionExpiredAlertProps {
  storeKey: string;
  message?: string;
}

const SubscriptionExpiredAlert: React.FC<SubscriptionExpiredAlertProps> = ({
  storeKey,
  message = 'Your subscription has expired. Please renew your subscription to access this feature.',
}) => {
  return (
    <section className="w-full min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <Alert variant="destructive" className="mb-6">
        <AlertTitle className="flex items-center gap-2 mb-2">
          Subscription Expired
        </AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>{message}</span>
          <Link
            to="/store/$storeKey/subscription"
            params={{ storeKey }}
            className="mt-2"
          >
            <Button variant="outline" size="sm" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Renew Subscription
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    </section>
  );
};

export default SubscriptionExpiredAlert;
