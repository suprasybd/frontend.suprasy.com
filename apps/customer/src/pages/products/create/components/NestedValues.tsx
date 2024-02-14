import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from '@frontend.suprasy.com/ui';
import { Trash2 } from 'lucide-react';
import React from 'react';
import { useFieldArray } from 'react-hook-form';

const NestedValues: React.FC<{ nestIndex: number; control: any }> = ({
  nestIndex,
  control,
}) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `VariantsOptions.${nestIndex}.Options`,
  });

  return (
    <div>
      {fields.map((item, k) => {
        return (
          <div key={item.id} style={{ marginLeft: 20 }}>
            <FormField
              control={control}
              name={`VariantsOptions.${nestIndex}.Options.${k}`}
              render={({ field }) => (
                <FormItem className=" rounded-lg pt-3">
                  <div className="flex gap-[7px] items-center">
                    <FormControl>
                      <Input placeholder="Value" {...field} />
                    </FormControl>
                    <Trash2
                      onClick={() => remove(k)}
                      className="hover:cursor-pointer"
                    />
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      })}

      <Button
        className="mt-3"
        onClick={(e) => {
          e.preventDefault();
          append('default_value');
        }}
      >
        Add More
      </Button>
    </div>
  );
};

export default NestedValues;
