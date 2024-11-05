import CreatePage from '@/pages/footer/CreatePage/CreatePage';
import { createFileRoute } from '@tanstack/react-router';

interface FooterType {
  update?: boolean;
  pageId?: number;
}

export const Route = createFileRoute('/store/$storeKey/footer/createpage')({
  component: () => <CreatePage />,
  validateSearch: (search: Record<string, unknown>): FooterType => {
    return {
      update: Boolean(search?.update ?? false),
      pageId: Number(search?.pageId),
    };
  },
});
