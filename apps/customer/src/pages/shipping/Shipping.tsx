import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@frontend.suprasy.com/ui';
import Area from './components/Area';

const Shipping: React.FC = () => {
  return (
    <section className="w-full max-w-[94rem] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <Tabs defaultValue="zones" className="w-full">
        <TabsList>
          <TabsTrigger value="zones">Zones (Area)</TabsTrigger>
          <TabsTrigger value="dmethod">Delivary Method</TabsTrigger>
        </TabsList>
        <TabsContent value="zones" className="w-full">
          <Area />
        </TabsContent>
        <TabsContent value="dmethod">Delivary Method</TabsContent>
      </Tabs>
    </section>
  );
};

export default Shipping;
