import {
  Card,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
} from '@customer/components/index';
import { Trash2 } from 'lucide-react';
import VariationImage from './VariationImage';

interface VariationCardProps {
  option: any;
  index: number;
  form: any;
  formErrors: any;
  onDelete: () => void;
}

export const VariationCard: React.FC<VariationCardProps> = ({
  option,
  index,
  form,
  formErrors,
  onDelete,
}) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-medium">Variation #{index + 1}</h3>
        <button
          onClick={onDelete}
          className="text-destructive hover:text-destructive/80"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <VariationImage fieldIndex={index} form={form} />

      <div className="grid gap-4 mt-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name={`ProductVariations.${index}.ChoiceName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variation Name</FormLabel>
              <FormControl>
                <Input
                  FormError={
                    !!formErrors?.ProductVariations?.[index]?.ChoiceName
                  }
                  placeholder="e.g. Small, Red, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`ProductVariations.${index}.Sku`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input
                  FormError={!!formErrors?.ProductVariations?.[index]?.Sku}
                  placeholder="SKU-123"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`ProductVariations.${index}.Price`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (BDT)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  FormError={!!formErrors?.ProductVariations?.[index]?.Price}
                  placeholder="0.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`ProductVariations.${index}.SalesPrice`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sales Price (BDT)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  FormError={
                    !!formErrors?.ProductVariations?.[index]?.SalesPrice
                  }
                  placeholder="0.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`ProductVariations.${index}.Inventory`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  FormError={
                    !!formErrors?.ProductVariations?.[index]?.Inventory
                  }
                  placeholder="0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Card>
  );
};
