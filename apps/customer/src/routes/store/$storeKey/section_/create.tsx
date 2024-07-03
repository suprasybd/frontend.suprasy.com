import CreateSection from '@customer/pages/StoreHome/create/CreateSection';
import { createFileRoute } from '@tanstack/react-router';

interface SectionSearchType {
  update?: boolean;
  sectionId?: number;
  uuid?: string;
}

export const Route = createFileRoute('/store/$storeKey/section/create')({
  component: () => <CreateSection />,
  validateSearch: (search: Record<string, unknown>): SectionSearchType => {
    return {
      update: Boolean(search?.update ?? false),
      sectionId: Number(search?.sectionId),
      uuid: String(search?.uuid || ''),
    };
  },
});
