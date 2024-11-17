import { getUserStoresList } from './pages/home/api';

// Add this guard to your dashboard route
{
  path: '/store/$storeKey/dashboard',
  beforeLoad: async ({ params }) => {
    try {
      const storesResponse = await getUserStoresList();
      const store = storesResponse.Data.find(
        (store) => store.StoreKey === params.storeKey
      );
      
      if (store && !store.IsActive) {
        throw new Error('Subscription expired');
      }
    } catch (error) {
      throw redirect({
        to: '/store/$storeKey/subscription',
        params: { storeKey: params.storeKey },
        search: { expired: 'true' }
      });
    }
  },
  // ... rest of your dashboard route configuration
} 