import React from 'react';

import MediaModal from './MediaModal/MediaModal';
import ProductSelectionWithVariation from './ProductSelection/ProductSelectionWithVariation';

const StoreModals: React.FC = () => {
  return (
    <div>
      <MediaModal />
      <ProductSelectionWithVariation />
    </div>
  );
};

export default StoreModals;
