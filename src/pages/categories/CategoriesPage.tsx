import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import Categories from './Categories';
import ProductCategories from './ProductCategories';

const CategoriesPage = () => {
  return (
    <div className="w-full min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <Tabs defaultValue="categories" className="w-full">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="product-category">Product Category</TabsTrigger>
        </TabsList>
        <TabsContent value="categories">
          <Categories />
        </TabsContent>
        <TabsContent value="product-category">
          <ProductCategories />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CategoriesPage;
