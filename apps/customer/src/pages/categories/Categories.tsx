import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  Button,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@frontend.suprasy.com/ui';
import { Link, useParams } from '@tanstack/react-router';

const Categories = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };

  return (
    <section className="w-full min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <Breadcrumb className="pb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link
              to="/store/$storeKey/dashboard"
              params={{ storeKey: storeKey }}
            >
              Home
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link
              to="/store/$storeKey/categories"
              params={{ storeKey: storeKey }}
            >
              Categories
            </Link>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="my-2">
        <h1>Add Category</h1>
        <Input className="my-3" placeholder="category name" />
        <Button>Add</Button>
      </div>
    </section>
  );
};

export default Categories;
