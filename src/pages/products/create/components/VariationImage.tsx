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
      <Card className="border border-dashed">
        <CardContent className="p-3">
          <div className="flex flex-wrap gap-2">
            {variationImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="relative w-[100px] h-[100px] rounded-md overflow-hidden">
                  <img
                    src={image.ImageUrl}
                    alt="product"
                    className="object-cover w-full h-full"
                  />
                  {index === 0 && (
                    <div className="absolute top-1 left-1 bg-yellow-300 text-red-600 rounded-sm p-0.5">
                      <Star className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* Image Controls Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (index !== 0) {
                        moveImage(index, index - 1);
                      } else {
                        moveImage(index, variationImages.length - 1);
                      }
                    }}
                    className="p-1 hover:bg-white/20 rounded"
                  >
                    <ArrowLeft className="w-4 h-4 text-white" />
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
                    className="p-1 hover:bg-white/20 rounded"
                  >
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeImage(index);
                    }}
                    className="p-1 hover:bg-white/20 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={(e) => {
                e.preventDefault();
                localStorage.setItem(
                  'variation_media_index',
                  fieldIndex.toString()
                );
                setModalPath({ modal: 'media', aspect: 1 });
              }}
              className="w-[100px] h-[100px] flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 hover:border-gray-400 transition-colors"
            >
              <Upload className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Upload Image
              </span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VariationImage;
