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
import { ExternalLink, MessagesSquare } from 'lucide-react';

interface AddBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddBalanceModal: React.FC<AddBalanceModalProps> = ({
  isOpen,
  onClose,
}) => {
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
              <MessagesSquare className="h-4 w-4" />
              Join Our Discord Community
            </AlertTitle>
            <AlertDescription className="mt-2 space-y-4">
              <p>To add balance to your account, please follow these steps:</p>
              <ol className="list-decimal pl-4 space-y-2">
                <li>Join our Discord community</li>
                <li>Create a support ticket</li>
                <li>Mention the amount you want to add</li>
                <li>Our team will assist you with the payment process</li>
              </ol>
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-3">
            <Button
              className="w-full"
              onClick={() =>
                window.open('https://discord.gg/J8xEsQKTqC', '_blank')
              }
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Join Discord
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
