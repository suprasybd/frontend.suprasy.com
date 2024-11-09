import { useMediaFormStore } from '@/store/mediaFormStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { createHero, getHero, updateHero } from './api';
import { useModalStore } from '@/store/modalStore';

import { Button, useToast } from '@/components';
import { Form, Card, CardContent, CardHeader, CardTitle } from '@/components';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, Star, Trash2 } from 'lucide-react';
import { useParams } from '@tanstack/react-router';

const ImageUrl = z.object({
  ImageLink: z.string().url(),
});

const formSchema = z.object({
  Images: z.array(ImageUrl),
});

const Hero = () => {
  const { storeKey } = useParams({ strict: false }) as {
    storeKey: string;
  };

  const { imagesList, setImagesList } = useMediaFormStore((state) => state);

  const { toast } = useToast();

  const { setModalPath } = useModalStore((state) => state);

  const { data: heroImagesResponse, refetch } = useQuery({
    queryKey: ['getHeroImages', storeKey],
    queryFn: getHero,
    enabled: !!storeKey,
  });

  const { mutate: handleCreateHero } = useMutation({
    mutationFn: createHero,
    onSuccess: () => {
      toast({
        title: 'hero added',
        description: 'done',
      });
      refetch();
    },
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Hero Create',
        description: response.response.data.Message,
        variant: 'destructive',
      });
    },
  });
  const { mutate: handleUpdateHero } = useMutation({
    mutationFn: updateHero,
    onSuccess: () => {
      toast({
        title: 'hero updated',
        description: 'done',
      });
    },
    onError: (response: { response: { data: { Message: string } } }) => {
      toast({
        title: 'Hero Update',
        description: response.response.data.Message,
        variant: 'destructive',
      });
    },
  });

  const heroImages = heroImagesResponse?.Data;

  useEffect(() => {
    if (imagesList && imagesList.length) {
      const formatedImagesList = imagesList.map((image) => ({
        ImageLink: image,
      }));

      handleCreateHero({ data: { Images: formatedImagesList } });

      setImagesList([]);
    }
    // eslint-disable-next-line
  }, [imagesList]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Images: [],
    },
  });

  // Add a ref to track initial load
  const initialLoadRef = useRef(true);

  const { move: moveImage, remove: removeImage } = useFieldArray({
    control: form.control,
    name: 'Images',
  });

  // Custom handlers for move and remove that trigger API updates
  const handleMove = (fromIndex: number, toIndex: number) => {
    moveImage(fromIndex, toIndex);
    const currentImages = form.getValues('Images');
    handleUpdateHero({ data: { Images: currentImages } });
  };

  const handleRemove = (index: number) => {
    removeImage(index);
    const currentImages = form.getValues('Images');
    handleUpdateHero({
      data: currentImages.length ? { Images: currentImages } : {},
    });
  };

  // Remove the form watch effect since we'll update directly
  useEffect(() => {
    if (heroImages && heroImages.length) {
      initialLoadRef.current = true;
      form.setValue('Images', heroImages, { shouldDirty: false });
    }
  }, [heroImages, form]);

  const productImages = form.watch('Images');

  return (
    <div>
      <Button
        className="my-3"
        onClick={() => {
          setModalPath({ modal: 'media', aspect: 3 });
        }}
      >
        Add Slider Image
      </Button>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Slider Images</CardTitle>
        </CardHeader>
        <CardContent>
          {productImages.length === 0 && <h1>No slider image found!</h1>}
          <Form {...form}>
            <div className="my-10 flex flex-wrap gap-[10px]">
              {productImages.map((image, index) => (
                <div
                  key={index}
                  className="rounded-sm relative border-gray-300 border-2"
                >
                  <div className="relative h-[160px] w-[200px] rounded-sm border broder-b-4 border-blue-400">
                    <img
                      src={image.ImageLink}
                      alt="product"
                      className="object-cover w-full h-full "
                    />
                  </div>
                  {index === 0 && (
                    <div className="absolute top-[-10px] left-[-10px] bg-yellow-300 text-red-600 rounded-lg p-1">
                      {' '}
                      <Star />
                    </div>
                  )}
                  <div className="flex w-full">
                    <button
                      type="button"
                      onClick={() => {
                        if (index !== 0) {
                          handleMove(index, index - 1);
                        } else {
                          handleMove(index, productImages.length - 1);
                        }
                      }}
                      className="w-full flex justify-center hover:bg-slate-300 border border-r-1 border-t-0 border-l-0 border-b-0 border-gray-500  p-2"
                    >
                      <ArrowLeft />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (index !== productImages.length - 1) {
                          handleMove(index, index + 1);
                        } else {
                          handleMove(index, 0);
                        }
                      }}
                      className="w-full flex justify-center hover:bg-slate-300 border border-r-1 border-t-0 border-l-0 border-b-0 border-gray-500  p-2"
                    >
                      <ArrowRight />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="w-full flex justify-center hover:bg-slate-300 p-2"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Hero;
