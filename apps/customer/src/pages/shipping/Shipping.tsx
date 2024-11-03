import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
} from '@customer/components/index';
import Area from './components/Area';
import ShippingMethod from './components/shipping-method/Method';

const Shipping: React.FC = () => {
  return (
    <section className="w-full max-w-[94rem] min-h-full mx-auto py-6 px-4 sm:px-8">
      <Card className="bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardContent className="p-6">
          <Tabs defaultValue="zones" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 mb-6">
              <TabsTrigger
                value="zones"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:border-b-2 rounded-none px-4 py-3"
              >
                Zones (Area)
              </TabsTrigger>
              <TabsTrigger
                value="dmethod"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:border-b-2 rounded-none px-4 py-3"
              >
                Delivery Method
              </TabsTrigger>
            </TabsList>
            <TabsContent value="zones" className="w-full mt-4">
              <Area />
            </TabsContent>
            <TabsContent value="dmethod" className="w-full mt-4">
              <ShippingMethod />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
};

export default Shipping;
