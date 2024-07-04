import Footer from '@customer/pages/footer/Footer';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/store/$storeKey/footer')({
  component: () => <Footer />,
});
