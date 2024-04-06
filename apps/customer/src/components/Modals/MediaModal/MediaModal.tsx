import { useFunctionStore } from '@customer/store/functionStore';
import { useModalStore } from '@customer/store/modalStore';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@frontend.suprasy.com/ui';

import { Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const MediaModal: React.FC = () => {
  const { modal, clearModalPath } = useModalStore((state) => state);
  const modalName = modal.modal;
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (modalName === 'media') {
      setModalOpen(true);
    }
  }, [modalName]);

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
        <DialogContent className="sm:min-w-[700px]">
          <DialogHeader>
            <DialogTitle>Media Managment</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="browse" className="w-full">
            <TabsList>
              <TabsTrigger value="browse">browse</TabsTrigger>
              <TabsTrigger value="upload">upload</TabsTrigger>
            </TabsList>
            <TabsContent value="browse">
              Make changes to your browse here.
            </TabsContent>
            <TabsContent value="upload">
              <div className="w-full flex justify-center my-10">
                <Label
                  className="w-full hover:cursor-pointer rounded h-full  flex justify-center items-center"
                  htmlFor="picture"
                >
                  <div className="flex aspect-square w-[170px] h-[170px] items-center justify-center rounded-md border border-dashed">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Upload</span>
                  </div>
                </Label>
                <Input
                  onChange={() => {
                    console.log('H i');
                  }}
                  className="hidden"
                  id="picture"
                  name="image"
                  type="file"
                  accept="image/*"
                />
              </div>
            </TabsContent>
          </Tabs>

          <Button onClick={() => closeModal()}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaModal;
