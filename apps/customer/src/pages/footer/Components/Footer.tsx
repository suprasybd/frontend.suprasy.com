import {
  Button,
  RichTextEditor,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@customer/components';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { getFooter, updateFooter } from '../api';

const FooterComponent = () => {
  const [description, setDescription] = useState<string>();

  const { data: footerResponse, isSuccess } = useQuery({
    queryKey: ['getFooter'],
    queryFn: getFooter,
  });

  const { mutate: handleUpdateFooter } = useMutation({
    mutationFn: updateFooter,
  });
  const footer = footerResponse?.Data;

  return (
    <div>
      <Card className="my-4 w-full">
        <CardHeader>
          <CardTitle>Footer</CardTitle>
          <CardDescription>Update Footer Info From here</CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess && (
            <RichTextEditor
              initialVal={footer?.Description}
              onValChange={(val) => {
                setDescription(JSON.stringify(val));
              }}
            />
          )}

          <Button
            className="my-3"
            onClick={() => {
              handleUpdateFooter({ Description: description || '' });
            }}
          >
            Save Footer Info
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FooterComponent;
