import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import ActiveDomain from './ActiveDomain';
import DomainList from './DomainList';

const Domain = () => {
  return (
    <div className="w-full min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <Tabs defaultValue="email" className="w-full">
        <TabsList>
          <TabsTrigger value="email">Active Domain</TabsTrigger>
          <TabsTrigger value="domains">domains</TabsTrigger>
        </TabsList>
        <TabsContent value="email">
          <ActiveDomain />
        </TabsContent>
        <TabsContent value="domains">
          <DomainList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Domain;
