/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { productSchema } from '../zod/productSchema';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/index';
import { ArrowLeft, ArrowRight, Star, Trash2, Upload } from 'lucide-react';
import { useModalStore } from '@/store/modalStore';
import { useMediaFormStore } from '@/store/mediaFormStore';
const VariationImage: React.FC<{
  fieldIndex: number;
  form: UseFormReturn<z.infer<typeof productSchema>>;
}> = ({ fieldIndex, form }) => {
  const {
    fields: variationImages,
    append: appendImage,
    remove: removeImage,
    move: moveImage,
  } = useFieldArray({
    control: form.control,
    name: `ProductVariations.${fieldIndex}.Images`,
  });

  const { setModalPath } = useModalStore((state) => state);

  const { imagesList, setImagesList } = useMediaFormStore((state) => state);

  useEffect(() => {
    if (imagesList && imagesList.length) {
      const formatedImagesList = imagesList.map((image) => ({
        ImageUrl: image,
      }));

      if (
        localStorage.getItem('variation_media_index') === fieldIndex.toString()
      ) {
        appendImage(formatedImagesList);
        setImagesList([]);
      }
    }
    console.log('run');
    // eslint-disable-next-line
  }, [imagesList]);

  return (
    <div>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Variation Images</CardTitle>
          <CardDescription>Select images and order them bellow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-[10px]">
            {variationImages.map((image, index) => {
              return (
                <div className="rounded-sm relative  border-gray-300 border-2">
                  <div className="relative h-[160px] w-[200px] rounded-sm border broder-b-4 border-blue-400">
                    <img
                      src={image.ImageUrl}
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
                  <div className="flex w-full ">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (index !== 0) {
                          moveImage(index, index - 1);
                        } else {
                          moveImage(index, variationImages.length - 1);
                        }
                      }}
                      className="w-full flex justify-center hover:bg-slate-300 border border-r-1 border-t-0 border-l-0 border-b-0 border-gray-500  p-2 "
                    >
                      <ArrowLeft />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (index !== variationImages.length - 1) {
                          moveImage(index, index + 1);
                        } else {
                          moveImage(index, 0);
                        }
                      }}
                      className="w-full flex justify-center hover:bg-slate-300 border border-r-1 border-t-0 border-l-0 border-b-0 border-gray-500  p-2 "
                    >
                      <ArrowRight />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeImage(index);
                      }}
                      className="w-full flex justify-center hover:bg-slate-300 p-2 "
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={(e) => {
              // set modal here
              e.preventDefault();
              localStorage.setItem(
                'variation_media_index',
                fieldIndex.toString()
              );
              setModalPath({ modal: 'media', aspect: 1 });
            }}
            className="flex aspect-square mt-10 w-[200px] h-[160px] items-center justify-center rounded-md border border-dashed"
          >
            <Upload className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Upload</span>
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VariationImage;
