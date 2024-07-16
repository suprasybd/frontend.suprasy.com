import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@customer/components/index';
import { useQuery } from '@tanstack/react-query';
import { getAllCategories } from './api';

const ProductCategories = () => {
  const { data: categoryResponse, refetch } = useQuery({
    queryKey: ['getCategories'],
    queryFn: () => getAllCategories(),
  });

  const categories = categoryResponse?.Data;

  return (
    <div>
      {/* prodcuts for categories */}
      {categories && categories.length > 0 && (
        <Tabs
          defaultValue={categories && categories[0].Id.toString()}
          className="w-[400px]"
        >
          <TabsList>
            {categories?.map((category) => (
              <TabsTrigger value={category.Id.toString()}>
                {category.Name}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories?.map((category) => (
            <TabsContent value={category.Id.toString()}>
              Make changes to your account here. {category.Name}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default ProductCategories;
