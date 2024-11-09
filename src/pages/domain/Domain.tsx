import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import ActiveDomain from './ActiveDomain';
import DomainList from './DomainList';
import { Globe2 } from 'lucide-react';

const Domain = () => {
  return (
    <div className="w-full min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Globe2 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold">Domain Management</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your custom domains and SSL certificates
        </p>
      </div>

      <div className="bg-gradient-to-br from-card/50 to-muted/20 rounded-lg border p-1">
        <Tabs defaultValue="domains" className="w-full">
          <TabsList className="grid w-full grid-cols-1 h-auto gap-4 bg-transparent p-0">
            <TabsTrigger
              value="domains"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <div className="flex items-center gap-2 px-1 py-2">
                <Globe2 className="h-4 w-4" />
                <span>Domains</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="domains" className="mt-6">
            <DomainList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Domain;
