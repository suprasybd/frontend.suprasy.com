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
} from '@customer/components/index';
import { useMutation, useQuery } from '@tanstack/react-query';
import 'react-image-crop/dist/ReactCrop.css';
import { CheckCheckIcon, Upload } from 'lucide-react';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { getStoreImages, uplaodImageToStore } from './api';
import Loader from '@customer/components/Loader/Loader';
import { useMediaFormStore } from '@customer/store/mediaFormStore';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  PixelCrop,
  type Crop,
} from 'react-image-crop';
import { useDebounceEffect } from './useDebounceEffect';
import { canvasPreview } from './canvasPreview';

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
  const defaultAspect = (modal.aspect as number) || 16 / 9;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [tab, setTab] = useState<string>('browse');
  const [selectedImages, setSelectedImages] = useState<string[]>();
  const [aspect, setAspect] = useState<number | undefined>(defaultAspect);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const { toast } = useToast();

  useEffect(() => {
    if (defaultAspect) {
      setAspect(defaultAspect);
    }
  }, [defaultAspect]);

  const { setImagesList } = useMediaFormStore((state) => state);
  const [crop, setCrop] = useState<Crop | undefined>({
    unit: '%', // Can be 'px' or '%'
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });

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
    setImgSrc('');
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
    enabled: modalOpen,
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
  const [imgSrc, setImgSrc] = useState('');

  function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number
  ) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  }

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setCrop(undefined);
    const selectedFile = e.target.files?.[0];

    if (selectedFile && e.target.files) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || '')
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  const uploadCropedImage = async () => {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist');
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offscreen.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: 'image/png',
    });

    const imgFile = new File([blob], 'cropedimage', { type: blob.type });

    const formData = new FormData();
    formData.append('ProductImage', imgFile);
    handleImageUploadApi(formData);
    setImgSrc('');
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

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
              <Button
                className="mt-3 w-full"
                disabled={!selectedImages}
                onClick={() => {
                  if (!Editor) {
                    if (selectedImages) {
                      setImagesList(selectedImages);
                    }

                    setSelectedImages([]);

                    closeModal();
                  }

                  if (
                    Editor &&
                    setFormData &&
                    selectedImages &&
                    ModalImageSubmit
                  ) {
                    console.log('updates', selectedImages);

                    ModalImageSubmit(selectedImages[0]);
                    setSelectedImages([]);

                    closeModal();
                  }
                }}
              >
                Pick Selected
              </Button>
            </TabsContent>
            <TabsContent value="upload">
              {!imgSrc && (
                <div className="w-full flex justify-center my-10">
                  {!isPending && !imgSrc && (
                    <>
                      <Label
                        className="w-full hover:cursor-pointer rounded h-full  flex justify-center items-center"
                        htmlFor="picture"
                      >
                        <div className="flex aspect-square w-[170px] h-[170px] items-center justify-center rounded-md border border-dashed">
                          <div className="w-full flex flex-col gap-[5px] justify-center items-center">
                            <Upload className="h-4 w-4 text-muted-foreground" />
                            <p className="sr-only">Upload</p>
                            <p>Max Size: 5 MB</p>
                          </div>
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
              )}

              {imgSrc && (
                <div>
                  <ReactCrop
                    aspect={aspect}
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                  >
                    <img
                      onLoad={onImageLoad}
                      ref={imgRef}
                      src={imgSrc}
                      alt="crop"
                    />
                  </ReactCrop>

                  <Button
                    disabled={isPending}
                    onClick={() => {
                      uploadCropedImage();
                    }}
                    className="w-full my-2"
                  >
                    {!isPending && 'Complete Crop & Upload'}

                    {isPending && <Loader />}
                  </Button>
                </div>
              )}
              <div>
                {completedCrop && (
                  <canvas
                    className="hidden"
                    ref={previewCanvasRef}
                    style={{
                      border: '1px solid black',
                      objectFit: 'contain',
                      width: completedCrop.width,
                      height: completedCrop.height,
                    }}
                  />
                )}
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
