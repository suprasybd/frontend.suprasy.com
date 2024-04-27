import { useModalStore } from '@customer/store/modalStore';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useToast,
} from '@frontend.suprasy.com/ui';
import { useMutation, useQuery } from '@tanstack/react-query';

import { CheckCheckIcon, Upload } from 'lucide-react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { getStoreImages, uplaodImageToStore } from './api';
import Loader from '@customer/components/Loader/Loader';
import { useMediaFormStore } from '@customer/store/mediaFormStore';

const MediaModal: React.FC<{
  Editor?: boolean;
  Open?: boolean;
  setFormData?: React.Dispatch<
    React.SetStateAction<{
      url: string;
      alt: string;
    }>
  >;
  ModalImageSubmit?: (val: string) => void;
}> = ({ Editor, Open, setFormData, ModalImageSubmit }) => {
  const { modal, clearModalPath } = useModalStore((state) => state);
  const modalName = modal.modal;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [tab, setTab] = useState<string>('browse');
  const [selectedImages, setSelectedImages] = useState<string[]>();

  const { toast } = useToast();

  const { setImagesList } = useMediaFormStore((state) => state);

  useEffect(() => {
    if (modalName === 'media' && !Editor) {
      setModalOpen(true);
    }
  }, [modalName]);

  useEffect(() => {
    if (Open) {
      setModalOpen(true);
    }
  }, [Open]);

  const closeModal = () => {
    setModalOpen(false);
    clearModalPath();
  };

  const {
    data: storeImagesResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['getStoreImagesList', modalOpen],
    queryFn: () => getStoreImages(1, 20),
  });

  const { mutate: handleImageUploadApi, isPending } = useMutation({
    mutationFn: uplaodImageToStore,
    onSuccess: () => {
      setTab('browse');
      refetch();
      toast({
        title: 'Image Upload',
        description: 'Image upload successfull',
        variant: 'default',
      });
    },
    onError: () => {
      toast({
        title: 'Image Upload',
        description: 'image upload failed!',
        variant: 'destructive',
      });
    },
  });

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const formData = new FormData();
      formData.append('ProductImage', selectedFile);
      handleImageUploadApi(formData);
    }
  };

  console.log('selected images', selectedImages);

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

          <Tabs
            defaultValue="browse"
            value={tab}
            onValueChange={(value) => setTab(value)}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="browse">browse</TabsTrigger>
              <TabsTrigger value="upload">upload</TabsTrigger>
            </TabsList>
            <TabsContent value="browse">
              {isLoading && <Loader />}
              {!isLoading && !storeImagesResponse?.Data?.length && (
                <div>You don't have any images please upload</div>
              )}

              {!isLoading &&
                storeImagesResponse?.Data &&
                storeImagesResponse?.Data?.length > 0 && (
                  <div className="max-h-[80vh] flex gap-[10px] flex-wrap overflow-auto">
                    {storeImagesResponse.Data.map((image) => {
                      return (
                        <div
                          key={image.Id}
                          className="w-[200px] relative h-[160px] cursor-pointer rounded-sm hover:border-blue-500 hover:border-2"
                          onClick={() => {
                            if (!selectedImages?.includes(image.ImageUrl)) {
                              setSelectedImages((prev) => {
                                if (prev) {
                                  return [...prev, image.ImageUrl];
                                } else {
                                  return [image.ImageUrl];
                                }
                              });
                            } else {
                              // image already inclused remove it
                              const filtered = selectedImages.filter(
                                (imageState) => imageState !== image.ImageUrl
                              );

                              setSelectedImages(filtered);
                            }
                          }}
                        >
                          {selectedImages?.includes(image.ImageUrl) && (
                            <CheckCheckIcon className="absolute top-[5px] right-[5px] text-green-300" />
                          )}

                          <img
                            className="object-cover w-full h-full rounded-sm"
                            src={image.ImageUrl}
                            alt="media"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
            </TabsContent>
            <TabsContent value="upload">
              <div className="w-full flex justify-center my-10">
                {!isPending && (
                  <>
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
                      onChange={handleImageUpload}
                      className="hidden"
                      id="picture"
                      name="image"
                      type="file"
                      accept="image/*"
                    />
                  </>
                )}
                {isPending && <Loader />}
              </div>
            </TabsContent>
          </Tabs>
          <Button
            disabled={!selectedImages}
            onClick={() => {
              if (!Editor) {
                if (selectedImages) {
                  setImagesList(selectedImages);
                }

                setSelectedImages([]);

                closeModal();
              }

              if (Editor && setFormData && selectedImages && ModalImageSubmit) {
                console.log('updates', selectedImages);

                ModalImageSubmit(selectedImages[0]);
                setSelectedImages([]);

                closeModal();
              }
            }}
          >
            Pick Selected
          </Button>
          <Button onClick={() => closeModal()}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaModal;
