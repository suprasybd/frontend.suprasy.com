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
import { MessageCircle } from 'lucide-react';

interface AddBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddBalanceModal: React.FC<AddBalanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const openTawkChat = () => {
    // Assuming Tawk.to's global object is available
    if (window.Tawk_API) {
      window.Tawk_API.maximize();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Balance</DialogTitle>
          <DialogDescription>
            Follow these steps to add balance to your account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertTitle className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Contact Support
            </AlertTitle>
            <AlertDescription className="mt-2 space-y-4">
              <p>To add balance to your account, please follow these steps:</p>
              <ol className="list-decimal pl-4 space-y-2">
                <li>Click the chat button below</li>
                <li>Mention the amount you want to add</li>
                <li>
                  Our support team will assist you with the payment process
                </li>
              </ol>
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-3">
            <Button className="w-full" onClick={openTawkChat}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Open Chat
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddBalanceModal;
