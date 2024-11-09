import { useModalStore } from '@/store/modalStore';
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
  DialogDescription,
  cn,
} from '@/components/index';
import { useMutation, useQuery } from '@tanstack/react-query';
import 'react-image-crop/dist/ReactCrop.css';
import { CheckCheckIcon, Upload } from 'lucide-react';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { getStoreImages, uplaodImageToStore } from './api';
import Loader from '@/components/Loader/Loader';
import { useMediaFormStore } from '@/store/mediaFormStore';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  PixelCrop,
  type Crop,
} from 'react-image-crop';
import { useDebounceEffect } from './useDebounceEffect';
import { canvasPreview } from './canvasPreview';
import PaginationMain from '@/components/Pagination/Pagination';

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
  const [page, setPage] = useState<number>(1);
  const limit = 10; // Fixed limit of 10 items per page

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
    queryKey: ['getStoreImagesList', modalOpen, page],
    queryFn: () => getStoreImages(page, limit),
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
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Image Upload',
        description: response.response.data.Message,
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
        <DialogContent className="sm:max-w-[900px] h-[80vh] overflow-y-scroll flex flex-col">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl font-semibold">
              Media Library
            </DialogTitle>
            <DialogDescription>
              Upload or select images from your media library
            </DialogDescription>
          </DialogHeader>

          <Tabs
            defaultValue="browse"
            value={tab}
            onValueChange={(value) => setTab(value)}
            className="flex-1 flex flex-col"
          >
            <TabsList className="w-full justify-start border-b px-1">
              <TabsTrigger
                value="browse"
                className="data-[state=active]:bg-primary/10"
              >
                Browse Library
              </TabsTrigger>
              <TabsTrigger
                value="upload"
                className="data-[state=active]:bg-primary/10"
              >
                Upload New
              </TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="flex-1 mt-0">
              {isLoading && (
                <div className="h-full flex items-center justify-center">
                  <Loader />
                </div>
              )}

              {!isLoading && !storeImagesResponse?.Data?.length && (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <Upload className="h-12 w-12 mb-4" />
                  <p className="text-lg font-medium">No images found</p>
                  <p className="text-sm">Upload some images to get started</p>
                </div>
              )}

              {!isLoading &&
                storeImagesResponse?.Data &&
                storeImagesResponse.Data.length > 0 && (
                  <div className="flex-1 flex flex-col h-full">
                    <div className="flex-1 grid grid-cols-3 md:grid-cols-4 gap-4 p-4">
                      {storeImagesResponse.Data.map((image) => (
                        <div
                          key={image.Id}
                          className={cn(
                            'relative aspect-square cursor-pointer rounded-lg border-2 overflow-hidden transition-all',
                            selectedImages?.includes(image.ImageUrl)
                              ? 'border-primary ring-2 ring-primary/30'
                              : 'border-transparent hover:border-primary/50'
                          )}
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
                            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                              <CheckCheckIcon className="h-8 w-8 text-primary" />
                            </div>
                          )}
                          <img
                            className="object-cover w-full h-full"
                            src={image.ImageUrl}
                            alt="media"
                          />
                        </div>
                      ))}
                    </div>

                    {storeImagesResponse.Pagination && (
                      <div className="p-4 border-t">
                        <PaginationMain
                          PaginationDetails={storeImagesResponse.Pagination}
                          setPage={setPage}
                        />
                      </div>
                    )}
                  </div>
                )}

              <div className="p-4 border-t mt-auto">
                <Button
                  className="w-full"
                  size="lg"
                  disabled={!selectedImages?.length}
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
                  {selectedImages?.length
                    ? `Use Selected (${selectedImages.length})`
                    : 'Select Images'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="flex-1 mt-0">
              {!imgSrc && (
                <div className="h-full flex items-center justify-center p-8">
                  <Label
                    className="w-full max-w-md hover:cursor-pointer"
                    htmlFor="picture"
                  >
                    <div className="border-2 border-dashed border-primary/50 rounded-lg p-8 text-center hover:border-primary transition-colors">
                      <div className="flex flex-col items-center gap-4">
                        <Upload className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <p className="text-lg font-medium">Click to upload</p>
                          <p className="text-sm text-muted-foreground">
                            Maximum file size: 5MB
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Supported formats: JPG, PNG, GIF
                          </p>
                        </div>
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
                </div>
              )}

              {imgSrc && (
                <div className="flex-1 p-4 flex flex-col gap-4">
                  <div className="flex-1 min-h-0">
                    <ReactCrop
                      aspect={aspect}
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      onComplete={(c) => setCompletedCrop(c)}
                      className="max-h-full"
                    >
                      <img
                        onLoad={onImageLoad}
                        ref={imgRef}
                        src={imgSrc}
                        alt="crop"
                        className="max-h-[60vh] mx-auto"
                      />
                    </ReactCrop>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setImgSrc('')}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      disabled={isPending}
                      onClick={uploadCropedImage}
                    >
                      {isPending ? <Loader /> : 'Upload Image'}
                    </Button>
                  </div>
                </div>
              )}

              <canvas ref={previewCanvasRef} className="hidden" />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaModal;
