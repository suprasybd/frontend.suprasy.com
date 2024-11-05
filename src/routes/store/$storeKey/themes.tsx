import Themes from '@/pages/themes/Themes';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/store/$storeKey/themes')({
  component: () => <Themes />,
});
