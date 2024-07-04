import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@customer/components/index';
import FooterComponent from './Components/Footer';
import Page from './Components/Page';

const Footer = () => {
  return (
    <section className="w-full min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <Tabs defaultValue="footer" className="w-full">
        <TabsList>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
        </TabsList>
        <TabsContent value="footer">
          <FooterComponent />
        </TabsContent>
        <TabsContent value="pages">
          <Page />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Footer;
