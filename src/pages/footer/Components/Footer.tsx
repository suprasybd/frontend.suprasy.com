import {
  Button,
  RichTextEditor,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  useToast,
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/components';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { getFooter, updateFooter } from '../api';
import { AlertTriangle, Save, ScrollText } from 'lucide-react';

const FooterComponent = () => {
  const [description, setDescription] = useState<string>();

  const { toast } = useToast();

  const { data: footerResponse, isSuccess } = useQuery({
    queryKey: ['getFooter'],
    queryFn: getFooter,
  });

  const { mutate: handleUpdateFooter, isPending } = useMutation({
    mutationFn: updateFooter,
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'done',
        description: 'updated',
      });
    },
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Footer Update',
        description: response.response.data.Message,
        variant: 'destructive',
      });
    },
  });
  const footer = footerResponse?.Data;

  return (
    <div className="space-y-6">
      <Card className="border-none bg-background/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-primary" />
            Footer Editor
          </CardTitle>
          <CardDescription>
            Customize your store's footer content. This will appear at the
            bottom of every page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {description && description?.length > 3000 && (
            <Alert variant="destructive">
              <AlertTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Content Too Long
              </AlertTitle>
              <AlertDescription>
                Footer description cannot exceed 3000 characters
              </AlertDescription>
            </Alert>
          )}

          {isSuccess && (
            <div className="border rounded-lg p-4 bg-background">
              <RichTextEditor
                initialVal={footer?.Description}
                onValChange={(val) => {
                  setDescription(JSON.stringify(val));
                }}
              />
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={() => {
                handleUpdateFooter({ Description: description || '' });
              }}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FooterComponent;
