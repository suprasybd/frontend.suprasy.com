import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/index';
import FooterComponent from './Components/Footer';
import Page from './Components/Page';
import { FileText, ScrollText } from 'lucide-react';

const Footer = () => {
  return (
    <div className="w-full min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ScrollText className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold">Footer & Pages</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your store's footer content and additional pages
        </p>
      </div>

      {/* Tabs Container */}
      <div className="bg-gradient-to-br from-card/50 to-muted/20 rounded-lg border p-1">
        <Tabs defaultValue="footer" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto gap-4 bg-transparent p-0">
            <TabsTrigger
              value="footer"
              className="relative data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all duration-200 hover:bg-muted/50"
            >
              <div className="flex items-center gap-2 px-3 py-3">
                <ScrollText className="h-4 w-4" />
                <span className="font-medium">Footer Content</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="pages"
              className="relative data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all duration-200 hover:bg-muted/50"
            >
              <div className="flex items-center gap-2 px-3 py-3">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Custom Pages</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="footer" className="mt-6 space-y-6">
            <FooterComponent />
          </TabsContent>
          <TabsContent value="pages" className="mt-6 space-y-6">
            <Page />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Footer;
