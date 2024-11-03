import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@customer/components/index';
import { Link, useParams } from '@tanstack/react-router';

import StoreHomeSections from './StoreHomeSections';
import Hero from './Hero';

const StoreHome = () => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };

  return (
    <section className="w-full min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      {/* breadcrumbs */}
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
            <Link to="/store/$storeKey/home" params={{ storeKey: storeKey }}>
              Home Page
            </Link>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList>
          <TabsTrigger value="hero">Slider Images</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
        </TabsList>
        <TabsContent value="hero">
          <Hero />
        </TabsContent>
        <TabsContent value="sections">
          <StoreHomeSections />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default StoreHome;
