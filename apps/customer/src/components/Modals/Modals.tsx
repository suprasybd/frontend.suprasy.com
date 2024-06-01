import React from 'react';

import CreateStoreModal from './CreateStore/CreateStore';
import UpdateCategory from './UpdateCategory/UpdateCategory';
import ProductSelection from './ProductSelection/ProductSelection';

const Modals: React.FC = () => {
  return (
    <div>
      <CreateStoreModal />
      <UpdateCategory />
      <ProductSelection />
    </div>
  );
};

export default Modals;
